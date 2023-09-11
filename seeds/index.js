const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("connection open")
    })
    .catch(err => {
        console.log('on no error')
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            author:'64f45d1e5a55d3f5ee04268c',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde rem vitae quia natus fugit fuga quo nisi consectetur sunt consequatur eveniet illum dolores magnam fugiat provident, iusto, iste deserunt? In Nobis impedit odit obcaecati earum velit enim, doloremque quia blanditiis, dolorum voluptatibus sunt molestias magni eaque accusamus maxime possimus consectetur? Asperiores perspiciatis aperiam natus nostrum cupiditate voluptas laboriosam, labore molestias.Sed optio molestiae eligendi quas ipsa. Nam explicabo aut obcaecati cumque quia enim in harum alias molestiae minima ipsum, numquam nemo iure esse sint quod! Officiis quibusdam harum quam? Mollitia.Architecto distinctio doloribus aliquam repellendus quidem, iste amet officia animi accusantium quis ducimus maiores reprehenderit. Rerum, odio iusto enim incidunt voluptates dicta in dolores eum libero mollitia? Minima, velit voluptates.Quibusdam obcaecati porro dolorem? Enim officia odit iste dicta fugiat minima placeat perferendis veritatis cum in id ducimus reiciendis voluptatem, velit eveniet sit impedit nisi quam? Quia, nisi odio. Labore.',
            price: `${Math.floor(Math.random( ) * 100)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/drtorq8qa/image/upload/v1693809174/YelpCamp/ff55pjkfsw8gwcspcsih.jpg',
                  filename: 'YelpCamp/ff55pjkfsw8gwcspcsih',
                }
              ],
        })
        await camp.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})
