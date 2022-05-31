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
If you want to break each exercise into multiple parts it is still okay.

* before creating a new branch make sure you have commit your work.
1. `git checkout master`
1. `git pull`
1. `git checkout -b name.lastname/describe-what-you-are-doing`
1.  make as many as commits you feel it is okay, but remember commits can tell a story. In the future if someone will maintain your project they probably are will at some point will need the commit messages to understand what happened. 
1. ???
1. profit
1. `git push --set-upstream origin name.lastname/describe-what-you-are-doing`
1. In your console you should see something like 
> remote: 
remote: Create a pull request for 'name.lastname/describe-what-you-are-doing ' on GitHub by visiting:  
remote:      https://github.com/your-repo-name/pull/new/name.lastname/describe-what-you-are-doing 

Follow that link in order to create a new pull request.
Once you finish working you need to press in the pull request page the big green button to merge your branch.

After you create your pull request you can continue adding more commits,
doing so you will need to execute `git push` to put them into the branch of your github repo.

If you are confused it is okay, it means that you are learning.
Ask questions, there are no stupid questions.
