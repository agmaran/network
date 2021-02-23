class NewPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '' };
        this.updateTextArea = this.updateTextArea.bind(this);
        this.post = this.post.bind(this);
    }

    updateTextArea(event) {
        this.setState({ text: event.target.value });
    }

    post(event) {
        fetch('/newpost', {
            method: 'POST',
            body: JSON.stringify({
                text: this.state.text
            })
        })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    const alert = document.createElement('div');
                    alert.classList = "alert alert-danger";
                    alert.innerHTML = result.error
                    document.querySelector('#new-post').append(alert);
                }
            })
    }

    render() {

        return (
            <div id="new-post" className="container col-12">
                <h2>New Post</h2>
                <form id="new-post-form" onSubmit={this.post}>
                    <textarea className="form-control" id="new-post-text" value={this.state.text} onChange={this.updateTextArea}></textarea>
                    <input type="submit" className="btn btn-primary mt-1 mb-1" value="Post" />
                </form>
            </div>
        );

    }
}
if (document.querySelector('#new-post').dataset.user === "user_is_authenticated") {
    ReactDOM.render(<NewPost />, document.querySelector('#new-post'));
}

class AllPosts extends React.Component {
    constructor(props) {
        super(props);
        this.state = { posts: [], current_user: '' };
    }

    componentDidMount() {
        fetch('/allposts')
            .then(response => response.json())
            .then(result => {
                console.log(result)
                this.setState({ posts: result.posts, current_user: result.current_user })
                document.querySelectorAll('.username').forEach(username => {
                    username.onclick = function () {
                        var url = `/${this.dataset.username}/profile`;
                        window.location = url
                    }
                })
            })
            .catch(e => {
                console.log(e);
            });
    };

    render() {
        var posts = this.state.posts.map((post) => {
            return (
                <div key={post.id} className="container col-12">
                    <a className="username" data-username={post.poster}><strong>{post.poster}</strong></a>
                    {this.state.current_user == post.poster &&
                        <div><a href="#">Edit</a></div>
                    }
                    <p>{post.content}</p>
                    <div className="timestamp">{post.timestamp}</div>
                    <div className="row">
                        <i className="bi bi-star ml-3 mr-1"></i>
                        <div>{post.likes}</div>
                    </div>
                </div>
            )
        })

        return <div>{posts}</div>

    }
}
ReactDOM.render(<AllPosts />, document.querySelector('#all-posts'));