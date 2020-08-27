# form-2-class-showoff
### Base64 Image Conversion For Database Upload
```
    previewFiles (event) {
      var v = this
      console.log(event.target.files[0])
      const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })

      async function Main () {
        // console.log(await toBase64(event.target.files[0]))
        v.imageUpload = await toBase64(event.target.files[0])
        // console.log(v.imageUpload)
      }

      Main()
    }
```
This is the Vue method that allows the use of images in firebase without having to use firestore, to briefly explain as a whole before diving into the code it grabs the image from `<input type="file" placeholder="imageURL" @change="previewFiles" id="imageURL"> ` and then sends it to the method which converts the image into a base64 string for upload to firebase.

#### How Does This Work?
1. We grab the file from the dom with by passing it into the method with `@change="previewFiles"` which is a Vue inline event handler. This gives us the `event` variable seen when the method is called.
2. Next we are declaring the Vue instance with `var v = this` which lets us use the Vue data
3. We then console log the the target file to see if we have something to work with `console.log(event.target.files[0])`
4. The next step is to convert the target file to base64 with the following function. This uses file reader to make a constant variable called  `toBase64` which is equal to a function that then reads the file. To read the file we need to set some peramaters for the reader script. `const reader = new FileReader()` This calls the filereader function. `reader.readAsDataURL(file)` This tells file reader what the file is to be converted. `reader.onload = () => resolve(reader.result)` This will print out the result if no error occurs. `reader.onerror = error => reject(error)` and this will give an error if there is one.
5. Next this function is called once the first completes: `async function Main ()` which uses this line to show the final conversion result in the console `console.log(await toBase64(event.target.files[0]))`
6. The last step is to then send the base64 string to the Vue data to be used in our upload method `v.imageUpload = await toBase64(event.target.files[0])`

#### Extra Notes
1. By using `async` the function will wait for the promise to be fulfilled by the child function before running, this is used with `await` which waits to call the specific function called `toBase64(event.target.files[0])`, this digs down and gives all the data to the function to make the conversion possible. `event` being the file from the dom. `target` being the file directory and `files[0]` being the first file since we are doing single image uploads.
