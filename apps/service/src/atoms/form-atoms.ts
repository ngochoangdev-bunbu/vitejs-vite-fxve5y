import { atom } from "jotai";
import { FormBooking } from "@repo/common-utils/interfaces";

export const formValidityAtom = atom(false);

export const contactNameAtom = atom("");
export const companyNameAtom = atom("");
export const recipientNameAtom = atom("");
export const emailAtom = atom("");
export const telAtom = atom("");

export const contactNoteAtom = atom("");
export const paymentMethodAtom = atom("1");
export const purposesAtom = atom<string[]>([]);
export const purposesOtherCheckedAtom = atom(false);
export const purposesOtherTextAtom = atom("");
export const surveyAtom = atom<string[]>([]);
export const surveyOtherCheckedAtom = atom(false);
export const surveyOtherTextAtom = atom("");

export const bookingsAtom = atom<FormBooking[]>([]);
