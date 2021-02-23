document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#follow-button').addEventListener('click', function () {
        if (this.innerHTML === "follow") {
            this.innerHTML = 'unfollow';
            fetch('/follow', {
                method: 'POST',
                body: JSON.stringify({
                    username: this.dataset.username
                })
            })
        }
        else {
            if (this.innerHTML === "unfollow") {
                this.innerHTML = 'follow';
                fetch('/unfollow', {
                    method: 'POST',
                    body: JSON.stringify({
                        username: this.dataset.username
                    })
                })
            }
        }
    })
})