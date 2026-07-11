# chengsh96.github.io

Redirect-only site.

Every request to `chengsh96.github.io` is forwarded to
[https://shihao-cheng.com](https://shihao-cheng.com), preserving the path,
query string, and hash, so old deep links keep working:

```
https://chengsh96.github.io/projects/shiftos.html
  -> https://shihao-cheng.com/projects/shiftos.html
```

The redirect happens in the browser (`window.location.replace`), served from
`index.html` for the root and `404.html` for every other path. There is no site
content here.
