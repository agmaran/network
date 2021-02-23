document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('#follow-button') !== null) {
        document.querySelector('#follow-button').addEventListener('click', function () {
            if (this.innerHTML === "follow") {
                this.innerHTML = 'unfollow';
                document.querySelector('#followers').innerHTML = `Followers: ${parseInt(document.querySelector('#followers').dataset.followers) + 1}`
                document.querySelector('#followers').dataset.followers = parseInt(document.querySelector('#followers').dataset.followers) + 1
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
                    document.querySelector('#followers').innerHTML = `Followers: ${parseInt(document.querySelector('#followers').dataset.followers) - 1}`
                    document.querySelector('#followers').dataset.followers = parseInt(document.querySelector('#followers').dataset.followers) - 1
                    fetch('/unfollow', {
                        method: 'POST',
                        body: JSON.stringify({
                            username: this.dataset.username
                        })
                    })
                }
            }
        })
    }
})