# Components

## Table of components

- [Components](#components)
  - [Table of components](#table-of-components)
    - [LoadingProcess](#loadingprocess)
      - [Usage](#usage)
      - [Props](#props)
    - [Sounds](#sounds)
    - [Development](#development)
      - [Methods](#methods)
      - [Properties](#properties)
      - [Props](#props-1)

### LoadingProcess

讀取畫面或是處理中畫面

#### Usage

```JSX
import { ActionType } from '@/settings/type';
import { Context} from '@/settings/constant';

const Pages = () => {
  const [, setContext] = useContext(Context);
  return (
    <button
      onClick={() => {
        setContext({ 
          type: ActionType.LoadingProcess, 
          state: { enabled: true } 
        });
      }}
    >
      Submit
    </button>
  );
};
```

#### Props

| Properties            |         description         |  default |
| :-------------------- | :-------------------------: | -------: |
| **enabled**:_boolean_ |        append to DOM        |    false |
| **type**:_string_     |     loading icon style      | 'spokes' |
| **body**:_component_  | description text under icon |       '' |

### Sounds

音效管理（Howler.js）：第一次點擊時讀取音檔、載入前的播放自動排隊、App 切回前景時接續背景音樂。

```JSX
const [{ sounds }] = useContext(Context);
sounds?.instance?.play('click');
```

完整說明與新增音效方式見 [sounds/readme.md](./sounds/readme.md)。

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
