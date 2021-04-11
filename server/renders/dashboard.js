const { v4: uuidV4 } = require('uuid')

// Home route function
const dashboard = async (req, res) => {
  try {
    console.log(uuidV4())
    res.render('dashboard', {
      roomIDS: uuidV4(),
      pageInf: {
        title: 'Rooms',
      },
    })
  } catch (err) {
    console.log(err)
  }
}

// Export route
module.exports = { dashboard }
