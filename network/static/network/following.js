class Likes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { post: '', liked: '' };
        this.like = this.like.bind(this);
        this.unlike = this.unlike.bind(this);
    }

    componentDidMount() {
        fetch('/post', {
            method: 'POST',
            body: JSON.stringify({
                post_id: this.props.post_id
            })
        })
            .then(response => response.json())
            .then(result => {
                console.log(result)
                this.setState({ post: result.post, liked: result.liked })
            })
            .catch(e => {
                console.log(e);
            });
    };

    like(event) {
        fetch('/likes', {
            method: 'POST',
            body: JSON.stringify({
                post_id: event.currentTarget.getAttribute("data-post")
            })
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ post: result.post, liked: result.liked })

            })
    }

    unlike(event) {
        fetch('/unlikes', {
            method: 'POST',
            body: JSON.stringify({
                post_id: event.currentTarget.getAttribute("data-post")
            })
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ post: result.post, liked: result.liked })
            })
    }

    render() {
        return (

            <div className="row">
                {!this.state.liked && <a data-post={this.state.post.id} onClick={this.like}><i className="bi bi-star ml-3 mr-1 pointer"></i></a>}
                {this.state.liked && <a data-post={this.state.post.id} onClick={this.unlike}><i className="bi bi-star-fill ml-3 mr-1 pointer"></i></a>}
                <div>{this.state.post.likes}</div>
            </div>

        )
    }
}

var c = document.getElementById("my-posts").children;
var i;
for (i = 0; i < c.length; i++) {
    ReactDOM.render(<Likes post_id={c[i].getAttribute("data-post")} />, document.querySelector(`#post-${c[i].getAttribute("data-post")}`))
}