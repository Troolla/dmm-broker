import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize, map } from 'rxjs';
import { SettingRestService } from 'src/app/shared/services/rest/setting.rest.service';

@Component({
  selector: 'app-exchange-setting',
  templateUrl: './exchange-setting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeSettingComponent implements OnInit {
  i: { ak?: string; sk?: string } = {};
  additional_input: string = '';
  listOfData: any[] = [];
  exchangeOptions: any;
  selectExchange: any;
  initialData: {} = {};
  statusControl = false;
  loading = false;
  exchange_name: any = '';

  formJson: any[] = [
    { label: 'ACCESS KEY', key: 'access_key', value: null, isRequired: false, isVisible: true },
    { label: 'SECRET KEY', key: 'secret_key', value: null, isRequired: false, isVisible: false },
    { label: 'PASSPHRASE', key: 'passphrase', value: null, isRequired: false, isVisible: false }
  ];

  tempJsonBackup: any[] = [];

  inputModel = this.formJson.map(x => {
    x.key;
  });

  constructor(
    public msg: NzMessageService,
    private settingRestService: SettingRestService,
    private cdr: ChangeDetectorRef,
    private notificationService: NzNotificationService
  ) {
    this.tempJsonBackup = this.formJson;
  }

  ngOnInit(): void {
    this.getData();
  }

  onSelectedExchange(value: number) {
    // this.selectedSymbol = '';
    this.clearSelectedArray();

    if (value == null) {
      this.selectExchange = '';
      // this.optionsSymbol = [{ value: '', label: '' }];
    } else {
      this.exchange_name = this.listOfData[value - 1];
      this.selectExchange = value;
      let i = 0;
      Object.keys(this.listOfData[value - 1]).map((xs: any) => {
        this.statusControl = this.listOfData[value - 1].status == 'A' ? false : true;
        const set = this.formJson.find((x: any) => x.key === xs);
        if (set?.key == 'access_key') {
          if (this.listOfData[value - 1].access_key.value !== '') {
            this.formJson[i].value = this.listOfData[value - 1].access_key.value;

            if (this.listOfData[value - 1].exchange === 'B2C2') {
              this.formJson[i].label = 'ACCESS URL';
            }
          }
          if (this.listOfData[value - 1].access_key.isRequired == true) {
            this.formJson[i].isRequired = true;
          } else {
            this.formJson[i].isRequired = false;
          }
          i++;
        }

        if (set?.key == 'secret_key') {
          if (this.listOfData[value - 1].secret_key.value !== '') {
            this.formJson[i].value = this.listOfData[value - 1].secret_key.value;
          }
          if (this.listOfData[value - 1].secret_key.isRequired == true) {
            this.formJson[i].isRequired = true;
          } else {
            this.formJson[i].isRequired = false;
          }
          i++;
        }

        if (set?.key == 'passphrase') {
          if (this.listOfData[value - 1].passphrase.value !== '') {
            this.formJson[i].value = this.listOfData[value - 1].passphrase.value;
          }
          if (this.listOfData[value - 1].passphrase.isRequired == true) {
            this.formJson[i].isRequired = true;
          } else {
            this.formJson[i].isRequired = false;
          }
        }
      });
    }
  }

  getData() {
    this.listOfData = [];
    this.loading = true;

    this.settingRestService
      .geAllExchangeCredentials()
      .pipe(
        map(res => {
          console.log('res', res);
          let i = 1;
          this.exchangeOptions = res;
          Object.keys(this.exchangeOptions).map(key => {
            const data = {
              id: i,
              exchange: key,
              access_key: {
                value: this.exchangeOptions[key].KEY.value.toString(),
                isRequired: this.exchangeOptions[key].KEY.isRequired
              },
              secret_key: {
                value: this.exchangeOptions[key].SECRET.value,
                isRequired: this.exchangeOptions[key].SECRET.isRequired
              },
              passphrase: {
                value: this.exchangeOptions[key].PASSPHRASE.value,
                isRequired: this.exchangeOptions[key].PASSPHRASE.isRequired
              },
              status: this.exchangeOptions[key].Status
            };
            i++;
            this.listOfData.push(data);
          });
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe();
  }

  reset() {
    this.formJson = [
      { label: 'ACCESS KEY', key: 'access_key', value: null, isRequired: false, isVisible: true },
      { label: 'SECRET KEY', key: 'secret_key', value: null, isRequired: false, isVisible: false },
      { label: 'PASSPHRASE', key: 'passphrase', value: null, isRequired: false, isVisible: false }
    ];
  }

  submit(index: any) {
    this.loading = true;

    this.formJson.forEach(x => {
      this.listOfData[index - 1][x.key].value = x.value;
    });

    let payload: any = {};

    this.listOfData.forEach((x, i) => {
      Object.assign(payload, {
        [x.exchange]: {
          KEY: x.access_key,
          SECRET: x.secret_key,
          PASSPHRASE: x.passphrase,
          Status: x.status
        }
      });
    });

    this.settingRestService
      .updateExchangeCredentials(payload, this.exchange_name.exchange)
      .pipe(
        map(res => {
          if (res == HttpStatusCode.Ok) {
            this.notificationService.success('Success', `${this.listOfData[index - 1].exchange} successfully updated!`);
          } else {
            this.notificationService.error('Invalid', 'Entered Keys Incorrect.');
          }
        }),
        finalize(() => {
          this.loading = false;
          this.getData();
        })
      )
      .subscribe();
  }

  clearSelectedArray(): void {
    this.formJson = [
      { label: 'ACCESS KEY', key: 'access_key', value: null, isRequired: false, isVisible: true },
      { label: 'SECRET KEY', key: 'secret_key', value: null, isRequired: false, isVisible: false },
      { label: 'PASSPHRASE', key: 'passphrase', value: null, isRequired: false, isVisible: false }
    ];
  }
}
