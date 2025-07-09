import * as Yup from "yup";

const rewardSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  nbRewardTowin: Yup.number().nullable().min(0, "Must be 0 or more"),
  isUnlimited: Yup.boolean(),
  percentage: Yup.number().required().min(0).max(100),
});

export const upsertRewardsValidator = Yup.object().shape({
  rewards: Yup.array()
    .of(rewardSchema)
    .min(1, "At least one reward is required")
    .test("unique-names", "Reward names must be unique", (rewards) => {
      if (!rewards) return true;
      const names = rewards.map((r) => r.name?.trim().toLowerCase());
      const uniqueNames = new Set(names);
      return uniqueNames.size === names.length;
    }),
});
