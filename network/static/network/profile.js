class Follow extends React.Component {
    constructor(props) {
        super(props);
        this.follow = this.follow.bind(this);
        const editLinks = document.querySelectorAll('.edit')
        console.log(editLinks)
        editLinks.forEach((edit) => {
            edit.addEventListener('click', event => {
                console.log("forEach works")
                ReactDOM.render(<EditPost post_id={event.currentTarget.getAttribute("data-post")} />, document.querySelector(`#post${event.currentTarget.getAttribute("data-post")}`))
            })
        })
    }

    follow(event) {
        if (event.currentTarget.innerHTML === "follow") {
            event.currentTarget.innerHTML = 'unfollow'
            document.querySelector('#followers').innerHTML = `Followers: ${parseInt(document.querySelector('#followers').getAttribute("data-followers")) + 1}`
            document.querySelector('#followers').setAttribute("data-followers", parseInt(document.querySelector('#followers').getAttribute("data-followers")) + 1)
            fetch('/follow', {
                method: 'POST',
                body: JSON.stringify({
                    username: document.querySelector('#follow-button').getAttribute("data-username")
                })
            })
        } else {
            if (event.currentTarget.innerHTML === "unfollow") {
                event.currentTarget.innerHTML = 'follow';
                document.querySelector('#followers').innerHTML = `Followers: ${parseInt(document.querySelector('#followers').getAttribute("data-followers")) - 1}`
                document.querySelector('#followers').setAttribute("data-followers", parseInt(document.querySelector('#followers').getAttribute("data-followers")) - 1)
                fetch('/unfollow', {
                    method: 'POST',
                    body: JSON.stringify({
                        username: document.querySelector('#follow-button').getAttribute("data-username")
                    })
                })
            }
        }
    }

    render() {
        if (document.querySelector('#follow-button').getAttribute("data-button") !== 'your_profile') {
            return (
                <button className="btn btn-primary" onClick={this.follow}>{document.querySelector('#follow-button').getAttribute("data-button")}</button>
            )
        } else {
            return (
                <span className="badge bg-secondary">Your Profile</span>
            )
        }
    }
}
if (document.querySelector('#follow-button')) {
    ReactDOM.render(<Follow />, document.querySelector('#follow-button'))
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
                {!this.state.liked && <a data-post={this.state.post.id} onClick={this.like}><i className="bi bi-star ml-3 mr-1"></i></a>}
                {this.state.liked && <a data-post={this.state.post.id} onClick={this.unlike}><i className="bi bi-star-fill ml-3 mr-1"></i></a>}
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