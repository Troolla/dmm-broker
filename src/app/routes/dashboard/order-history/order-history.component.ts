import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { Store } from '@ngxs/store';
import { finalize, map, Observable } from 'rxjs';
import { GlobalState } from 'src/app/core/store/global.state';
import { DateConstant } from 'src/app/shared/constants/date.constant';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format.pipe';
import { ExportService } from 'src/app/shared/services/export.service';
import { FeedRestService } from 'src/app/shared/services/rest/feed.rest.service';
import commonUtil from 'src/app/shared/utils/common-util';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryComponent implements OnInit {
  $orders!: Observable<any>;
  loading = false;

  // table props
  DATE = DateConstant;
  total = 0;
  pageIndex = 1;
  pageSize = 100;
  criteriaStored = undefined;
  data = [];

  exportData = [];
  user: any;

  constructor(
    private feedRestService: FeedRestService,
    private cdr: ChangeDetectorRef,
    private datePipe: DateFormatPipe,
    private exportService: ExportService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.select(GlobalState.getUser).subscribe(value => {
      this.user = value;
    });
  }

  getData($criteria?: any): void {
    this.criteriaStored = $criteria;
    this.loading = true;
    const dateFrom = this.datePipe.transform(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), DateConstant.BACKEND_INPUT_DATE_FORMAT);
    const dateTo = this.datePipe.transform(new Date(), DateConstant.BACKEND_INPUT_DATE_FORMAT);

    this.$orders = this.feedRestService.getOrderHistory(this.criteria($criteria)).pipe(
      map(res => {
        const { data, total } = res;
        this.total = total;
        this.data = data;
        if (data) {
          return commonUtil.deepCopy(data);
        } else {
          return data;
        }
      }),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    );

    this.feedRestService
      .getOrderHistory({
        fromDate: dateFrom,
        toDate: dateTo,
        orderBy: 'createdDate',
        orderSequence: -1
      })
      .pipe(
        map(async res => {
          if (res.data) {
            this.exportData = res.data;
            let i = 2;

            // Long queue, so logout should stop trigger API
            while (this.exportData.length !== res.total && this.user) {
              const callback = async () =>
                new Promise(resolve => {
                  this.feedRestService
                    .getOrderHistory({
                      fromDate: dateFrom,
                      toDate: dateTo,
                      orderBy: 'createdDate',
                      orderSequence: -1,
                      page: i,
                      limit: 1000
                    })
                    .pipe(
                      map(res => {
                        if (res.data && res.data.length > 0) {
                          this.exportData = this.exportData.concat(res.data);
                        }
                      }),
                      finalize(() => {
                        resolve(null);
                      })
                    )
                    .subscribe();
                });

              await callback();
              i++;
            }
          }
        }),
        finalize(() => {
          this.cdr.detectChanges();
        })
      )
      .subscribe();
  }

  reset(): void {
    this.getData();
  }

  export(): void {
    const data: any[] = [];
    this.exportData.forEach((d: any) => {
      // Remove unncessary things
      delete d.updatedBy;
      delete d.updatedDate;
      delete d.createdBy;

      data.push({
        ...d,
        orderTime: this.datePipe.transform(d.orderTime, 'dd/MM/yyyy HH:mm:ss'),
        createdDate: this.datePipe.transform(d.createdDate, this.DATE.CURRENT_DATE_TIME_FORMAT),
        orderResult: d.orderResult === 'C' ? 'Matched' : d.orderResult === 'P' ? 'Pending for confirmation' : 'Not matched'
      });
    });
    this.exportService.exportToCsv(data, `order_history`);
  }

  private criteria($criteria: any = { pageIndex: 1, pageSize: 10, sort: [] }) {
    const { pageIndex = 1, pageSize = 100, sort = [] } = $criteria;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    const sortObj = sort.find((i: { key: string; value: string }) => i.value != null);
    const orderBy = sortObj ? sortObj?.key : 'createdDate';
    const orderSequence = sortObj ? (sortObj?.value == 'ascend' ? 1 : -1) : -1;

    return {
      limit: this.pageSize,
      page: this.pageIndex,
      orderBy,
      orderSequence
    };
  }
}
