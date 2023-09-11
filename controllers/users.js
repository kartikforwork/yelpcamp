const User=require('../models/user')

module.exports.renderRegister= (req, res) => {
    res.render('users/register')
}
module.exports.register=async (req, res) => {
    try {
        const { email, password, username } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser,err=>{
            if(err)return next(err)
        })
        req.flash('success', 'Welcome to Campground')
        res.redirect('/campgrounds')
    } catch (error) {
        res.send(error)
    }
}
module.exports.renderLogin=(req,res)=>{
    res.render('users/login')
}
module.exports.login=(req,res)=>{
    req.flash('success','welcome back')
    const redirectUrl=req.session.returnTo || '/campgrounds';
    delete req.session.returnTo
    res.redirect(redirectUrl)
}
module.exports.logout=(req,res)=>{
    req.logout((err) => {
        if (err) {
            req.flash('success', "can't logout");
            console.error(err);
        }
        req.flash('success', 'Goodbye');
        res.redirect('/campgrounds');
    });
}
