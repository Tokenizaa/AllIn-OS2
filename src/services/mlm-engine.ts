import {
  PlanModule,
  NetworkModule,
  CommissionModule,
  BonusModule,
  PointsModule,
  QualificationModule,
  WalletModule,
  PayoutModule,
} from "@/modules/mlm-engine";

export const MlmEngineService = {
  plans: PlanModule,
  network: NetworkModule,
  commissions: CommissionModule,
  bonus: BonusModule,
  points: PointsModule,
  qualifications: QualificationModule,
  wallet: WalletModule,
  payouts: PayoutModule,
};
