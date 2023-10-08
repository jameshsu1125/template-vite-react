# Components

## Table of components

- [Components](#components)
  - [Table of components](#table-of-components)
    - [LoadingProcess](#loadingprocess)
      - [Usage](#usage)
      - [Props](#props)
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
