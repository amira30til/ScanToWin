import * as Yup from "yup";
import i18n from "@/i18n";
const rewardSchema = Yup.object().shape({
  name: Yup.string().required(() => i18n.t("validation.rewardNameRequired")),
  nbRewardTowin: Yup.number().nullable().min(0, "Must be 0 or more"),
  isUnlimited: Yup.boolean(),
  percentage: Yup.number()
    .required(() => i18n.t("validation.percentageRequired"))
    .min(0)
    .max(100),
});

export const upsertRewardsSchema = Yup.object().shape({
  rewards: Yup.array()
    .of(rewardSchema)
    .min(1,  () => i18n.t("validation.atLeastOneReward"))
    .test("unique-names",() => i18n.t("validation.uniqueRewardNames"), (rewards) => {
      if (!rewards) return true;
      const names = rewards.map((r) => r.name?.trim().toLowerCase());
      const uniqueNames = new Set(names);
      return uniqueNames.size === names.length;
    }),
});
