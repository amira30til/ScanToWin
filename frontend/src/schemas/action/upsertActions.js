import * as Yup from "yup";

const actionSchema = Yup.object().shape({
  targetLink: Yup.string(),
});

export const upsertActionsSchema = Yup.object().shape({
  actionsByShop: Yup.array()
    .of(actionSchema)
    .min(1, "At least one action is required"),
});
