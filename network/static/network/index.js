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
            <div className="container col-12">
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

class EditPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = { content: '' };
        this.updateTextArea = this.updateTextArea.bind(this);
        this.save = this.save.bind(this);
    }

    updateTextArea(event) {
        this.setState({ content: event.target.value });
    }

    save(event) {
        fetch('/editpost', {
            method: 'POST',
            body: JSON.stringify({
                content: this.state.content,
                post_id: this.props.post_id
            })
        })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    console.log(result.error)
                } else {
                    document.querySelector(`#post${this.props.post_id}`).innerHTML = this.state.content
                }
            })
        event.preventDefault();
    }

    render() {

        return (
            <div className="container col-12">
                <form id="edit-post-form" onSubmit={this.save}>
                    <textarea className="form-control" id="edit-post-text" value={this.state.content} onChange={this.updateTextArea}></textarea>
                    <input type="submit" className="btn btn-primary mt-1 mb-1" value="Save" />
                </form>
            </div>
        );

    }
}

class AllPosts extends React.Component {
    constructor(props) {
        super(props);
        this.state = { posts: [], current_user: '', postsStart: 0, postsEnd: 10, content: '' };
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.goProfile = this.goProfile.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        fetch('/allposts')
            .then(response => response.json())
            .then(result => {
                console.log(result)
                this.setState({ posts: result.posts, current_user: result.current_user })
            })
            .catch(e => {
                console.log(e);
            });
    };

    previousPage() {
        var start = this.state.postsStart - 10;
        var end = this.state.postsEnd - 10;

        this.setState({ postsStart: start, postsEnd: end });
    }

    nextPage() {
        var start = this.state.postsStart + 10;
        var end = this.state.postsEnd + 10;

        this.setState({ postsStart: start, postsEnd: end });
    }

    goProfile(event) {
        var page = 1
        var url = `/${page}/${event.currentTarget.getAttribute("data-username")}/profile`;
        window.location = url
    }

    edit(event) {
        ReactDOM.render(<EditPost post_id={event.currentTarget.getAttribute("data-post")} />, document.querySelector(`#post${event.currentTarget.getAttribute("data-post")}`))
    }

    render() {

        var posts = this.state.posts.map((post) => {
            return (
                <div key={post.id} className="container col-12">
                    <a className="username" data-username={post.poster} onClick={this.goProfile}><strong>{post.poster}</strong></a>
                    {this.state.current_user == post.poster &&
                        <div><a data-post={post.id} onClick={this.edit} className="page-link" >Edit</a></div>
                    }
                    <div id={"post" + post.id}>{post.content}</div>
                    <div className="timestamp">{post.timestamp}</div>
                    <div className="row">
                        <i className="bi bi-star ml-3 mr-1"></i>
                        <div>{post.likes}</div>
                    </div>
                </div>
            )
        })

        return (
            <div>
                <div>{posts.slice(this.state.postsStart, this.state.postsEnd)}</div>
                <nav aria-label="Page navigation example" className="col-12">
                    <ul className="pagination">
                        {this.state.postsStart > 0 && <li className="page-item"><a className="page-link" onClick={this.previousPage}>Previous</a></li>}
                        {this.state.posts.length > 10 && this.state.posts.length > this.state.postsEnd && <li className="page-item"><a className="page-link" onClick={this.nextPage}>Next</a></li>}
                    </ul>
                </nav>
            </div>
        )

    }
}
ReactDOM.render(<AllPosts />, document.querySelector('#all-posts'));