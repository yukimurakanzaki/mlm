'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

type Message = { role: 'user' | 'bot'; text: string };

export const ChatWidget = () => {
  const t = useTranslations('Chat');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [{ role: 'bot', text: t('greeting') }]);
  const inputRef = useRef<HTMLInputElement>(null);

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = inputRef.current?.value.trim();

    if (!text || pending) {
      return;
    }

    inputRef.current!.value = '';
    setMessages(prev => [...prev, { role: 'user', text }]);
    setPending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, locale }),
      });
      const data = (await response.json()) as { answer?: string };
      setMessages(prev => [...prev, { role: 'bot', text: data.answer ?? t('error') }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: t('error') }]);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-20">
      {open && (
        <div className="
          mb-2 flex h-96 w-80 flex-col rounded-lg border bg-background shadow-lg
          max-sm:w-[calc(100vw-2rem)]
        "
        >
          <div className="border-b p-3 font-semibold">{t('title')}</div>

          <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm" aria-live="polite">
            {messages.map((message, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={message.role === 'user'
                  ? 'ml-8 rounded-lg bg-primary p-2 text-primary-foreground'
                  : 'mr-8 rounded-lg bg-muted p-2'}
              >
                {message.text}
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex gap-2 border-t p-2">
            <input
              ref={inputRef}
              maxLength={500}
              aria-label={t('input_label')}
              placeholder={t('placeholder')}
              className="
                min-w-0 flex-1 rounded-md border bg-background px-2 py-1.5
                text-sm
              "
            />
            <Button type="submit" size="sm" disabled={pending}>{t('send')}</Button>
          </form>
        </div>
      )}

      <Button size="lg" className="ml-auto flex rounded-full shadow-lg" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        {open ? t('close') : t('open')}
      </Button>
    </div>
  );
};
