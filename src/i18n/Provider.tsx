'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useMemo } from 'react';

type Props = {
  locale: string;
  messages: IntlMessages;
  children: ReactNode;
  now?: Date;
  timeZone?: string;
};

type IntlMessages = {
  [key: string]: string | IntlMessages;
};

type RichTextChunk = string | ReactNode;

// Rich text components to be used in translations
const richTextComponents = {
  strong: (chunks: RichTextChunk) => <strong>{chunks}</strong>,
  em: (chunks: RichTextChunk) => <em>{chunks}</em>,
};

export default function NextIntlProvider({
  locale,
  messages,
  now,
  timeZone,
  children,
}: Props) {
  const mergedNow = useMemo(() => now || new Date(), [now]);
  const mergedTimeZone = useMemo(() => timeZone || 'UTC', [timeZone]);

  // Create a messages object that includes our rich text components
  const enhancedMessages = useMemo(() => ({
    ...messages,
    // Merge rich text components into messages
    ...richTextComponents,
  }), [messages]);

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={enhancedMessages}
      timeZone={mergedTimeZone}
      now={mergedNow}
      // @ts-ignore - Ignore the type error for the rich text components
      defaultRichTextElements={richTextComponents}
    >
      {children}
    </NextIntlClientProvider>
  );
}
