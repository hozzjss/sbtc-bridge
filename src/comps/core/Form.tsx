import { useFormik } from "formik";
import { PrimaryButton } from "./FlowButtons";
import { useAtomValue, useSetAtom } from "jotai";
import { showConnectWalletAtom, walletInfoAtom } from "@/util/atoms";
import { useEffect, useMemo, useState } from "react";
import { Schema as YupSchema } from "yup";
import { SubText } from "./Heading";
// this is supposed to be as reusable as possible given all the flows are very similar in order and action
type FlowFormProps = {
  nameKey: string;
  placeholder: string;
  initialValue?: string;
  handleSubmit: (
    value: string | undefined,
  ) => Promise<void | undefined | string> | void;
  type?: "text" | "number";
  children?: React.ReactNode;
  validationSchema?: YupSchema;
  disabled?: boolean;
  requiredConnection?: "stx" | "btc" | "both";
  initialNote?: string;
};
// tailwind div that reset all default form styles

export const FlowForm = ({
  nameKey,
  placeholder,
  initialValue,
  handleSubmit,
  type,
  children,
  validationSchema,
  disabled,
  requiredConnection = "btc",
  initialNote,
}: FlowFormProps) => {
  const walletInfo = useAtomValue(walletInfoAtom);
  const isConnected = useMemo(() => {
    const { payment, stacks } = walletInfo.addresses;
    if (requiredConnection === "btc") {
      return !!payment?.address;
    }
    if (requiredConnection === "stx") {
      return !!stacks?.address;
    }
    if (requiredConnection === "both") {
      return !!payment?.address && !!stacks?.address;
    }
  }, [requiredConnection, walletInfo.addresses]);

  const connectText = useMemo(() => {
    const { payment, stacks } = walletInfo.addresses;
    const isBTCConnected = !!payment?.address;
    const isSTXConnected = !!stacks?.address;
    if (requiredConnection === "btc" && !isBTCConnected) {
      return "Connect Bitcoin wallet";
    }
    if (requiredConnection === "stx" && !isSTXConnected) {
      return "Connect Stacks wallet";
    }

    return "Connect wallet";
  }, [requiredConnection, walletInfo.addresses]);
  const setShowConnectWallet = useSetAtom(showConnectWalletAtom);

  const formik = useFormik({
    initialValues: {
      [nameKey]: initialValue,
    },
    onSubmit: async (values) => {
      const error = await handleSubmit(values[nameKey]);
      if (error && typeof error === "string") {
        await formik.setFieldTouched(nameKey, true, true);
        formik.setErrors({ [nameKey]: error });
      }
    },
    validationSchema,
  });

  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (!dirty) {
      setDirty(formik.dirty);
    }
  }, [dirty, formik.dirty]);

  return (
    <form
      className="w-full flex flex-1 flex-col gap-14 justify-end font-Matter"
      onSubmit={formik.handleSubmit}
    >
      <div className="relative ">
        {initialNote && (
          <div
            className={`${!dirty && initialValue ? "visible" : "invisible"}`}
          >
            <SubText>{initialNote}</SubText>
          </div>
        )}

        <input
          type={type}
          name={nameKey}
          placeholder={placeholder}
          value={formik.values[nameKey]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={disabled}
          className={`w-full py-2 border-b-2 bg-transparent text-xl text-black focus:outline-none placeholder-gray-300 ${
            formik.isValid ? "border-orange" : "border-red-300"
          } transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        <p className="text-red-500 text-sm h-4">{formik.errors[nameKey]}</p>
      </div>
      <div className="w-full flex-row flex justify-between items-center">
        {children}
        {isConnected ? (
          <PrimaryButton
            type="submit"
            onClick={formik.handleSubmit}
            disabled={!formik.isValid || disabled}
          >
            NEXT
          </PrimaryButton>
        ) : (
          <button
            disabled={disabled}
            type="button"
            onClick={() => setShowConnectWallet(true)}
            className="uppercase bg-orange px-4 py-2 rounded-md font-Matter text-xs font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {connectText}
          </button>
        )}
      </div>
    </form>
  );
};
export type NameKeysInfo = {
  [key: string]: string;
  nameKey: string;
  initValue: string;
  placeholder: string;
  type: "text" | "number";
};
type FlowFormDynamicProps = {
  nameKeys: NameKeysInfo[];
  handleSubmit: (values: Record<string, string>) => void;
  children?: React.ReactNode;
};
export const FlowFormDynamic = ({
  nameKeys,
  handleSubmit,
  children,
}: FlowFormDynamicProps) => {
  const formik = useFormik({
    initialValues: nameKeys.reduce(
      (acc: { [key: string]: string }, { nameKey, initValue }) => {
        acc[nameKey] = initValue;
        return acc;
      },
      {},
    ),

    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <form
      className="w-full flex flex-1 flex-col gap-14 justify-end"
      onSubmit={formik.handleSubmit}
    >
      {nameKeys.map(({ nameKey, placeholder, type }) => (
        <div key={nameKey} className="relative ">
          <input
            type={type}
            name={nameKey}
            placeholder={placeholder}
            value={formik.values[nameKey]}
            onChange={formik.handleChange}
            className={`w-full py-2 border-b-2 bg-transparent text-xl text-black focus:outline-none placeholder-gray-300 ${
              formik.isValid ? "border-orange" : "border-midGray"
            } transition-colors duration-500`}
          />
        </div>
      ))}

      <div className="w-full flex-row flex justify-between items-center">
        {children}
        <PrimaryButton
          type="submit"
          onClick={formik.handleSubmit}
          isValid={formik.isValid}
        >
          NEXT
        </PrimaryButton>
      </div>
    </form>
  );
};
