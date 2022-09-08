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
  moduleList = [];
  exchangeDetails: any = {};
  selectModule: any;
  selectedExchange: any;
  multipleKeys = ['Coincheck'];

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

      this.selectedExchange = this.listOfData[value - 1].exchange;
      if (this.multipleKeys.includes(this.listOfData[value - 1].exchange)) {
        this.moduleList = this.listOfData[value - 1].modules;
        this.exchangeDetails = this.listOfData[value - 1];
      } else {
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
  }

  onSelectedModules(value: string) {
    this.exchangeDetails.list.forEach((attr: any) => {
      if (attr.module === value) {
        this.statusControl = attr.status == 'A' ? false : true;
        Object.keys(attr).map((xs: any) => {
          const set = this.formJson.find((x: any) => x.key === xs);
          if (set?.key == 'access_key') {
            if (attr.access_key.value !== '') {
              this.formJson[0].value = attr.access_key.value;
            }
            if (attr.access_key.isRequired == true) {
              this.formJson[0].isRequired = true;
            } else {
              this.formJson[0].isRequired = false;
            }
          }

          if (set?.key == 'secret_key') {
            if (attr.secret_key.value !== '') {
              this.formJson[1].value = attr.secret_key.value;
            }
            if (attr.secret_key.isRequired == true) {
              this.formJson[1].isRequired = true;
            } else {
              this.formJson[1].isRequired = false;
            }
          }

          if (set?.key == 'passphrase') {
            if (attr.passphrase.value !== '') {
              this.formJson[2].value = attr.passphrase.value;
            }
            if (attr.passphrase.isRequired == true) {
              this.formJson[2].isRequired = true;
            } else {
              this.formJson[2].isRequired = false;
            }
          }
        });
      }
    });
  }

  getData() {
    this.listOfData = [];
    this.loading = true;

    this.settingRestService
      .geAllExchangeCredentials()
      .pipe(
        map(res => {
          this.exchangeOptions = res;
          Object.keys(this.exchangeOptions).map((key, i) => {
            if (this.multipleKeys.includes(key)) {
              const list: any[] = [];
              const modules = this.exchangeOptions[key].map((x: any) => x.Modules);
              this.exchangeOptions[key].forEach((attr: any) => {
                list.push({
                  exchange: key,
                  access_key: {
                    value: attr.KEY.value,
                    isRequired: attr.KEY.isRequired
                  },
                  secret_key: {
                    value: attr.SECRET.value,
                    isRequired: attr.SECRET.isRequired
                  },
                  passphrase: {
                    value: attr.PASSPHRASE.value,
                    isRequired: attr.PASSPHRASE.isRequired
                  },
                  status: attr.Status,
                  module: attr.Modules
                });
              });

              this.listOfData.push({
                id: i + 1,
                exchange: key,
                list,
                modules
              });
            } else {
              this.listOfData.push({
                id: i + 1,
                exchange: key,
                access_key: {
                  value: this.exchangeOptions[key].KEY.value,
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
              });
            }
          });
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe();
  }

  submit(index: any) {
    this.loading = true;

    const data = {};
    const changes = {};

    // Update inputs stored
    if (this.multipleKeys.includes(this.selectedExchange)) {
      this.listOfData[index - 1].list = this.listOfData[index - 1].list.map((attr: any) => {
        if (attr.module === this.selectModule) {
          this.formJson.forEach((x: any) => {
            attr[x.key].value = x.value ? x.value : '';
          });
        }
        return attr;
      });
    } else {
      this.formJson.forEach(x => {
        this.listOfData[index - 1][x.key].value = x.value;
      });
    }

    // Raw data for API
    this.listOfData.forEach((x, i) => {
      if (this.multipleKeys.includes(x.exchange)) {
        const moduleDetails: any[] = [];
        x.list.forEach((attr: any) => {
          if (this.multipleKeys.includes(this.selectedExchange) && attr.module === this.selectModule) {
            Object.assign(changes, {
              [x.exchange]: {
                KEY: attr.access_key,
                SECRET: attr.secret_key,
                PASSPHRASE: attr.passphrase,
                Status: attr.status,
                Modules: this.selectModule
              }
            });
          }

          moduleDetails.push({
            KEY: attr.access_key,
            Modules: attr.module,
            PASSPHRASE: attr.passphrase,
            SECRET: attr.secret_key,
            Status: attr.status
          });
        });

        Object.assign(data, {
          [x.exchange]: moduleDetails
        });
      } else {
        Object.assign(changes, {
          [x.exchange]: {
            KEY: x.access_key,
            SECRET: x.secret_key,
            PASSPHRASE: x.passphrase,
            Status: x.status
          }
        });

        Object.assign(data, {
          [x.exchange]: {
            KEY: x.access_key,
            SECRET: x.secret_key,
            PASSPHRASE: x.passphrase,
            Status: x.status
          }
        });
      }
    });

    const payload = {
      changes,
      data
    };
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
    this.selectModule = null;
    this.formJson = [
      { label: 'ACCESS KEY', key: 'access_key', value: null, isRequired: false, isVisible: true },
      { label: 'SECRET KEY', key: 'secret_key', value: null, isRequired: false, isVisible: false },
      { label: 'PASSPHRASE', key: 'passphrase', value: null, isRequired: false, isVisible: false }
    ];
  }
}
