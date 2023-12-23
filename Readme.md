# Fingerfarben

I wanted a simple drawing tool for my daughter where she can paint on the touchscreen of my laptop.

I did not find anything suitable for kids that is not bloated, overcomplicated, free and without ads, so i wrote my own.

![Demo](https://github.com/thomai-d/fingerfarben/blob/master/media/demo.webp)

# Features
- Easy to use
- Supports multitouch
- Text to speech (disabled by default, see `config.ts`)
- Crossplatform
- OpenSource

# How to run
```
cd src
docker build -t fingerfarben .
docker run --rm -it -p 8080:80 fingerfarben
```

Navigate to http://localhost:8080