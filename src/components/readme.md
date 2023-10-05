[![NPM](https://img.shields.io/badge/NPM-ba443f?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![React](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![React](https://img.shields.io/badge/-ReactJs-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://zh-hant.reactjs.org/)
[![React](https://img.shields.io/badge/Less-1d365d?style=for-the-badge&logo=less&logoColor=white)](https://lesscss.org/)
[![React](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://www.w3schools.com/html/)
[![React](https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3schools.com/css/)
[![NPM](https://img.shields.io/badge/DEV-Jameshsu1125-9cf?style=for-the-badge)](https://www.npmjs.com/~jameshsu1125)

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
import { Context } from '@/settings/config';
import { ACTION } from '@/settings/constant';

const Pages = () => {
  const [, setContext] = useContext(Context);
  return (
    <button
      onClick={() => {
        setContext({ type: ACTION.LoadingProcess, state: { enabled: true } });
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
