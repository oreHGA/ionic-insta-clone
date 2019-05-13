const express = require('express')
const bodyParser = require('body-parser')
const Pusher = require('pusher');

const app = express();

let pusher = new Pusher({
    appId: 'PUSHER_APP_ID',
    key: 'PUSHER_APP_KEY',
    secret: 'PUSHER_APP_SECRET',
    cluster: 'PUSHER_APP_CLUSTER',
    useTLS: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.post('/trigger-post-event', (req, res) => {
    // trigger a new post event via pusher
    pusher.trigger('post-channel', 'new-post', {
        'post': req.body
    })

    res.json({ 'status': 200 });
});

app.post('/trigger-comment-event', (req, res) => {
    // trigger a new comment event via pusher
    pusher.trigger('comment-channel', 'new-comment', {
        'comment': req.body
    });

    res.json({ 'status': 200 });
})

let port = 3128;
app.listen(port, () => {
    console.log('App listening on port' + port);
});