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
                    username: event.currentTarget.getAttribute("data-username")
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
                        username: event.currentTarget.getAttribute("data-username")
                    })
                })
            }
        }
    }

    render() {
        if (document.querySelector('#follow-button').getAttribute("data-button") !== null) {
            return (
                <button className="btn btn-primary" onClick={this.follow}>{document.querySelector('#follow-button').getAttribute("data-button")}</button>
            )
        } else{
            return(<button className="btn btn-primary" onClick={this.follow}>This is your profile</button>)
        }
    }
}

ReactDOM.render(<Follow />, document.querySelector('#follow-button'))

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