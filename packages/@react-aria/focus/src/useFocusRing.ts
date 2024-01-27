import {DOMAttributes} from '@react-types/shared';
import {isFocusVisible, useFocus, useFocusVisibleListener, useFocusWithin} from '@react-aria/interactions';
import {useCallback, useEffect, useRef, useState} from 'react';

export interface AriaFocusRingProps {
  /**
   * Whether to show the focus ring when something
   * inside the container element has focus (true), or
   * only if the container itself has focus (false).
   * @default 'false'
   */
  within?: boolean,

  /** Whether the element is a text input. */
  isTextInput?: boolean,

  /** Whether the element will be auto focused. */
  autoFocus?: boolean,
  tabIndex?: number | string
}

export interface FocusRingAria {
  /** Whether the element is currently focused. */
  isFocused: boolean,

  /** Whether keyboard focus should be visible. */
  isFocusVisible: boolean,

  /** Props to apply to the container element with the focus ring. */
  focusProps: DOMAttributes
}

/**
 * Determines whether a focus ring should be shown to indicate keyboard focus.
 * Focus rings are visible only when the user is interacting with a keyboard,
 * not with a mouse, touch, or other input methods.
 */
export function useFocusRing(props: AriaFocusRingProps = {}): FocusRingAria {
  let {
    autoFocus = false,
    isTextInput,
    within,
    tabIndex
  } = props;
  let state = useRef({
    isFocused: false,
    isFocusVisible: autoFocus || isFocusVisible()
  });
  let [isFocused, setFocused] = useState(false);
  let [isFocusVisibleState, setFocusVisible] = useState(() => state.current.isFocused && state.current.isFocusVisible);

  let updateState = useCallback(() => setFocusVisible(state.current.isFocused && state.current.isFocusVisible), []);

  let onFocusChange = useCallback(isFocused => {
    state.current.isFocused = isFocused;
    setFocused(isFocused);
    updateState();
  }, [updateState]);

  useEffect(() => {
    if (tabIndex === null && isFocused) {
      onFocusChange(false);
    }
  }, [tabIndex, onFocusChange, isFocused]);

  useFocusVisibleListener((isFocusVisible) => {
    state.current.isFocusVisible = isFocusVisible;
    updateState();
  }, [], {isTextInput});

  let {focusProps} = useFocus({
    isDisabled: within,
    onFocusChange
  });

  let {focusWithinProps} = useFocusWithin({
    isDisabled: !within,
    onFocusWithinChange: onFocusChange
  });

  if (tabIndex === null) {
    focusProps = undefined;
  }
  return {
    isFocused,
    isFocusVisible: isFocusVisibleState,
    focusProps: within ? focusWithinProps : focusProps
  };
}
