import * as Yup from "yup";

const actionSchema = Yup.object().shape({
  targetLink: Yup.string().required("Name is required"),
});

export const upsertActionsValidator = Yup.object().shape({
  rewards: Yup.array()
    .of(actionSchema)
    .min(1, "At least one action is required"),
});
