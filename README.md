## How we are going to work

As you already know this is going to be a project that we are going to be building together each day. To organize our work each of us we are going to create a new repo in our github/gitlab.

## Workflow 

### Create a new repo

These are the step to create a new repo.
1. Create a new repo in github or gitlab what ever you prefer.
1. Create a new folder in our computer.
1. Inside create a new empty file README.md
1. `git init`
1. `git add README.md`
1. `git commit -m "Here be Dragons"`
1. `git remote add origin git@github.com:your-repo-path`
1. `git push -u origin master`  

After finishing the above steps if you refresh your the page in your github/gitlab you should see the README.md

### For each exercise

For each exercise we are going to create a merge request into master to do that we need first to create a new branch from master.

1. `git checkout master`
1. `git checkout -b name.lastname/describe-what-you-are-doing`
1. `git push –set-upstream origin new-branch`
