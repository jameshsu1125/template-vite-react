# Extracted characters

字型子集（subset）用的字元清單。`extract.tsx` 的 `char` 放入要保留的文字，`extractedCharacters()` 會去除重複字元後回傳字串；此資料夾不在 `src/` 內，不參與建置。

```ts
import { extractedCharacters } from './extract';

extractedCharacters(); // 'abc123...'（不重複）
```

預設保留的基本字元：

```txt
0123456789
abcdefghijklmnopqrstuvwxyz
ABCDEFGHIJKLMNOPQRSTUVWXYZ
+-~!@#$%^&*|}{}\][]';":?><>/.,
```

產出的字串可貼到字型子集工具使用，輸出的 woff2 等字型檔放進 `src/` 即可（CDN 規則見根目錄 [README.md](../README.md) 的「圖片與字型 CDN」）。
