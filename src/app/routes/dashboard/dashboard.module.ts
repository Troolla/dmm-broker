import { NgModule } from '@angular/core';
import { CountDownModule } from '@delon/abc/count-down';
import { OnboardingModule } from '@delon/abc/onboarding';
import { QuickMenuModule } from '@delon/abc/quick-menu';
import { G2BarModule } from '@delon/chart/bar';
import { G2CardModule } from '@delon/chart/card';
import { G2GaugeModule } from '@delon/chart/gauge';
import { G2MiniAreaModule } from '@delon/chart/mini-area';
import { G2MiniBarModule } from '@delon/chart/mini-bar';
import { G2MiniProgressModule } from '@delon/chart/mini-progress';
import { NumberInfoModule } from '@delon/chart/number-info';
import { G2PieModule } from '@delon/chart/pie';
import { G2RadarModule } from '@delon/chart/radar';
import { G2SingleBarModule } from '@delon/chart/single-bar';
import { G2TagCloudModule } from '@delon/chart/tag-cloud';
import { G2TimelineModule } from '@delon/chart/timeline';
import { TrendModule } from '@delon/chart/trend';
import { G2WaterWaveModule } from '@delon/chart/water-wave';
import { SharedModule } from '@shared';
import { CountdownModule } from 'ngx-countdown';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format.pipe';

import { BalanceAdjustmentComponent } from './balance-adjustment/balance-adjustment.component';
import { CurrentRateComponent } from './current-rate/current-rate.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ExposureComponent } from './exposure/exposure.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderSettingComponent } from './order-setting/order-setting.component';
import { SettingsHistoryLogsComponent } from './settings-history-logs/settings-history-logs.component';
import { DashboardV1Component } from './v1/v1.component';

const COMPONENTS = [
  DashboardV1Component,
  OrderSettingComponent,
  BalanceAdjustmentComponent,
  SettingsHistoryLogsComponent,
  CurrentRateComponent,
  ExposureComponent,
  OrderHistoryComponent
];

@NgModule({
  imports: [
    SharedModule,
    DashboardRoutingModule,
    // CountDownModule,
    // CountdownModule,
    // G2BarModule,
    G2CardModule
    // G2GaugeModule,
    // G2MiniAreaModule,
    // G2MiniBarModule,
    // G2MiniProgressModule,
    // G2PieModule,
    // G2RadarModule,
    // G2SingleBarModule,
    // G2TagCloudModule,
    // G2TimelineModule,
    // G2WaterWaveModule,
    // NumberInfoModule,
    // TrendModule,
    // QuickMenuModule,
    // OnboardingModule
  ],
  declarations: [...COMPONENTS],
  providers: [DateFormatPipe]
})
export class DashboardModule {}
