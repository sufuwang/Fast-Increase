import React, { useContext } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, DatePicker, List } from "antd";
import AmountFormItem from "../Amount";
import { Currencies } from "../../const";
import { Context, getTodayDate, getUUID, handleDate } from "../../tools";

type DataKeys = "alipay" | "wechat" | "mainlandBank" | "hkBank";
export type AccountFieldType = {
  id: string;
  date: string;
  comment?: string;
} & Record<
  DataKeys,
  {
    currency: string;
    amount?: string;
  }
>;
type AccountDBType = DBType<AccountFieldType, DataKeys>;

export default function Account() {
  const [form] = Form.useForm();
  const { context, setContext } = useContext(Context);

  const onFinish: FormProps<AccountFieldType>["onFinish"] = (value) => {
    setContext({
      ...context,
      AccountBill: [
        ...(context.AccountBill ?? []),
        Object.assign(value, { id: getUUID() }),
      ],
    });
    form.resetFields();
  };

  return (
    <Form
      form={form}
      initialValues={{
        date: getTodayDate(),
        ...Object.fromEntries(
          ["alipay", "wechat", "mainlandBank"].map((key) => [
            [key],
            {
              currency: Currencies[0].value,
              amount: 0,
            },
          ]),
        ),
        ...Object.fromEntries(
          ["hkBank"].map((key) => [
            [key],
            {
              currency: Currencies[1].value,
              amount: 0,
            },
          ]),
        ),
      }}
      labelCol={{ span: 4 }}
      onFinish={onFinish}
    >
      <Form.Item<AccountFieldType>
        label="日期"
        name="date"
        rules={[{ required: true }]}
      >
        <DatePicker className="!w-[34%]" placeholder="" />
      </Form.Item>

      <AmountFormItem namePrefix="alipay" label="支付宝" />

      <AmountFormItem namePrefix="wechat" label="微信" />

      <AmountFormItem namePrefix="mainlandBank" label="大陆银行" />

      <AmountFormItem namePrefix="hkBank" label="香港银行" />

      <Form.Item<AccountFieldType> label="备注" name="comment">
        <Input.TextArea placeholder="请填写备注" />
      </Form.Item>

      <Form.Item className="flex justify-end !mb-0">
        <Button type="primary" htmlType="submit">
          确认
        </Button>
      </Form.Item>
    </Form>
  );
}

export const AccountId = "AccountBill" as const;
export const AccountRender = (value: AccountDBType) => {
  const ds = [value.alipay, value.wechat, value.mainlandBank, value.hkBank]
    .filter((item) => (item.amount ?? "").length > 0)
    .map((item) => `${item.currency}-${item.amount}`)
    .join(" / ");
  return (
    <List.Item.Meta
      title={`${value.date.format("YYYY-MM-DD")}${ds.length ? ` / ${ds}` : ""}`}
      description={value.comment}
    />
  );
};
export const AccountHandlers = {
  async POST(value: AccountFieldType[]) {
    fetch("/api/bill/account", {
      method: "POST",
      body: JSON.stringify(handleDate(value)),
    });
  },
};
