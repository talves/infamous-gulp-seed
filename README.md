#[Infamous][1]-[Gulp][2]-Seed using (Browserify and Babel)
> A seed project to get started with the famous engine with Browserify and using Gulp as a task manager

This seed has .  
This seed allows for Multiple entry points.  

### Features
 - Browserify using watchify and babelify (ES6)
 - Multiple bundle support using the gulp/config:browserify:bundleConfigs
 - Uses Browser-Sync for serving up the dev

---

###Installation

```bash
git clone https://github.com/talves/infamous-gulp-seed
cd famous-gulp-seed
# rm -rf .git && git init && git commit -m "Initial Commit" # optionally reset git history
npm i # install dependencies
```

---

###Development  
 Run the dev server with ```gulp``` or ```gulp dev```

 - Now the dev server should be running on localhost:3000

---  

###Production  
 Run the build for production with ```gulp production```

 - Builds everything into `public`

---  

###Create [Demo][4] - Deploy to [Github Pages into org.github.io/repository-name][3] (gh-pages branch)
Runs the "Production" build and creates a `gh-pages` branch if it does not exist and commits the `public` directory  

```bash
gulp deploy-production
```

---

###LICENSE

MIT

[1]: https://github.com/Infamous/engine
[2]: https://github.com/gulpjs/gulp
[3]: https://github.com/talves/infamous-gulp-seed/tree/gh-pages
[4]: http://talves.github.io/infamous-gulp-seed/
