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
                }
            })
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

export default EditPost;