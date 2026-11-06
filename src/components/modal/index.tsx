import Button from '@/components/button';
import { Context, ModalState } from '@/settings/constant';
import { ActionType } from '@/settings/type';
import { memo, useCallback, useContext, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

const Modal = memo(() => {
  const [context, setContext] = useContext(Context);
  const modalState = context[ActionType.Modal];

  // 只關閉：整包還原成初始值，不觸發 onClose
  const closeModal = useCallback(() => {
    setContext({ type: ActionType.Modal, state: { ...ModalState, enabled: false } });
  }, [setContext]);

  // 先呼叫 onClose(buttonLabel)；onClose 回傳 false 代表使用者要保持開啟
  const handleButtonClick = async (buttonLabel: string) => {
    const onCloseResult = await modalState?.onClose?.(buttonLabel);
    const shouldStayOpen = onCloseResult === false;
    if (!shouldStayOpen) closeModal();
  };

  const labels = [modalState?.label ?? ModalState.label ?? []].flat();
  const lastButtonIndex = labels.length - 1;

  useEffect(() => {
    const closeOnEscape = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [closeModal]);

  return (
    <div
      className='Modal fixed inset-0 z-40 flex items-center justify-center p-4'
      role='dialog'
      aria-modal='true'
    >
      {/* 點擊背景只關閉，不觸發 onClose */}
      <div className='bg-base-100 absolute inset-0 opacity-90' onClick={closeModal} />
      <div className='bg-base-200 text-base-content relative flex max-h-[83vh] w-full max-w-md flex-col space-y-4 overflow-auto rounded-lg p-6 shadow-lg'>
        <Button
          className='text-base-content absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full text-xl'
          onClick={closeModal}
        >
          <IoClose />
        </Button>
        {modalState?.title && <h2 className='pr-8 text-xl font-bold'>{modalState.title}</h2>}
        {modalState?.body && <div>{modalState.body}</div>}
        <div className='flex justify-end space-x-2'>
          {labels.map((label, index) => {
            const isPrimaryButton = index === lastButtonIndex;
            return (
              <Button key={label} onClick={() => handleButtonClick(label)}>
                {isPrimaryButton ? (
                  <Button.Primary>{label}</Button.Primary>
                ) : (
                  <span className='bg-base-300 text-base-content block rounded-md px-4 py-2'>
                    {label}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default Modal;
