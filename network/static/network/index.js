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
                    console.log(error)
                }
            })
    }

    render() {
        return (
            <div>
                <h2>New Post</h2>
                <form id="new-post-form" onSubmit={this.post}>
                    <textarea className="form-control" id="new-post-text" value={this.state.text} onChange={this.updateTextArea}></textarea>
                    <input type="submit" className="btn btn-primary" value="Post" />
                </form>
            </div>
        );
    }
}
ReactDOM.render(<NewPost />, document.querySelector('#new-post'));