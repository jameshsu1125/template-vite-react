# Hooks

## Table of components

- [Hooks](#hooks)
  - [Table of components](#table-of-components)
  - [useSoundsOnFirstTouch](#usesoundsonfirsttouch)
  - [HookA](#hooka)
    - [Usage](#usage)
    - [Development](#development)
      - [Methods](#methods)
      - [Properties](#properties)
      - [Props](#props)

## useSoundsOnFirstTouch

使用者第一次點擊畫面（`pointerdown` / `keydown`）時建立 `Sounds`、讀取全部音檔，並寫入 `context.sounds`。已在 `src/pages/index.tsx` 呼叫，一般不需再使用。

```tsx
const [state, setState] = useReducer(Reducer, InitialState);
useSoundsOnFirstTouch(setState);
```

詳見 [components/sounds/readme.md](../components/sounds/readme.md)。

## HookA

### Usage

### Development

#### Methods

| method                              | description | return |
| :---------------------------------- | :---------: | -----: |
| .**functionName**(**arg**:_string_) |     xxx     |   void |

#### Properties

| Properties            | description | default |
| :-------------------- | :---------: | ------: |
| .**enable**:_boolean_ |     xxx     |    true |

#### Props

| Properties         | description | default |
| :----------------- | :---------: | ------: |
| **title**:_string_ |     xxx     |      '' |
