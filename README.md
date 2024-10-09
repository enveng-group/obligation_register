# ECMS Development Setup

## Change Localisation to Australian English using UTF-8

To change the locale in Ubuntu 24.04 LTS to en_AU.UTF-8 and update it across all available locales, you can follow these
steps:

Edit the locale generation file by ensuring all lines are commented out: `sudo nano /etc/locale.gen`. Save and exit the
file.

Ensure that the required locale is generated: `sudo locale-gen en_AU.UTF-8`.

Reconfigure locales: `sudo dpkg-reconfigure locales`.

Edit the /etc/default/locale file: `sudo nano /etc/default/locale`.

In this file, set the following:

```bash
LANG=en_AU.UTF-8
LANGUAGE=en_AU.UTF-8
LC_TIME=en_AU.UTF-8
LC_NUMERIC=en_AU.UTF-8
LC_MONETARY=en_AU.UTF-8
LC_PAPER=en_AU.UTF-8
LC_NAME=en_AU.UTF-8
LC_ADDRESS=en_AU.UTF-8
LC_TELEPHONE=en_AU.UTF-8
LC_MEASUREMENT=en_AU.UTF-8
LC_IDENTIFICATION=en_AU.UTF-8
LC_MESSAGES=en_AU.UTF-8
LC_COLLATE=en_AU.UTF-8
LC_CTYPE=en_AU.UTF-8
LC_ALL=en_AU.UTF-8
```

Save and exit the file (in nano, press `Ctrl+X`, then `Y`, then `Enter`).

Update the locale configuration:
`sudo update-locale LANG=en_AU.UTF-8 LANGUAGE=en_AU.UTF-8 LC_TIME=en_AU.UTF-8 LC_NUMERIC=en_AU.UTF-8 LC_MONETARY=en_AU.UTF-8 LC_PAPER=en_AU.UTF-8 LC_NAME=en_AU.UTF-8 LC_ADDRESS=en_AU.UTF-8 LC_TELEPHONE=en_AU.UTF-8 LC_MEASUREMENT=en_AU.UTF-8 LC_IDENTIFICATION=en_AU.UTF-8 LC_MESSAGES=en_AU.UTF-8 LC_COLLATE=en_AU.UTF-8 LC_CTYPE=en_AU.UTF-8 LC_ALL=en_AU.UTF-8`.

Reboot your system: `sudo reboot`.

After these steps, when you run `locale -a`, you should only see en_AU.utf8 along with the default C, C.utf8, and POSIX
locales, which are required by the system and cannot be removed.

## Change Timezone to Australian Western Standard Time

To change the timezone in Ubuntu 24.04 LTS to Australian Western Standard Time (Perth/Australia), you can follow these
steps:

Open a terminal window.

Check the current timezone: `timedatectl`.

List available timezones to confirm the exact name for Perth: `timedatectl list-timezones | grep Australia` and look
for "Australia/Perth" in the output.

Set the new timezone using the following command: `sudo timedatectl set-timezone Australia/Perth` and enter your
password when prompted.

Verify that the timezone has been changed: `timedatectl`. You should see that the timezone is now set to
Australia/Perth.

You can also check the current time to ensure it's correct: `date`.

## TODO: Activating Ubuntu Pro in Production Environment (ONLY)

TODO: `sudo pro attach C13vo6VYZYFAYpbFNMsGmFr5tJcx2H`

TODO: Enable all Pro services.

## Getting Ubuntu Up-To-Date

### APT - Ubuntu's .deb Package Repository and Manager

Here are step-by-step instructions to ensure both snap and apt packages are up to date after a fresh install of Ubuntu
24.04 LTS:

First, update the apt package index: `sudo apt update`.

Perform a full upgrade, which may also install or remove packages if necessary: `sudo apt full-upgrade -y`.

Remove any unnecessary packages that were automatically installed as dependencies: `sudo apt autoremove -y`.

Clean up the local repository of retrieved package files: `sudo apt autoclean`.

### Snap - Canonical's Preferred Application Packaging Management System for Ubuntu

Update all installed snap packages: `sudo snap refresh`.

Optionally, you can check for any held back snap updates: `snap list --all | grep disabled`.

If there are any, you may need to remove the old version manually.

Reboot your system to ensure all updates are applied: `sudo reboot`.

### Additional Notes

After the reboot, your system should be fully up to date with the latest packages from both apt and snap.

Additional notes:

It's a good practice to run these update commands regularly, perhaps weekly or bi-weekly, to keep your system secure and
up-to-date.
If you encounter any errors during the update process, make sure to read the error messages carefully and seek help if
needed.
Some updates may require a system restart to take effect fully.
Always ensure you have a stable internet connection when performing system updates.

## Setup Nano

Open or create the Nano config file: `nano ~/.nanorc` and add the following:

```bash
# Syntax highlighting
include "/usr/share/nano/*.nanorc"

# Line Numbers
set linenumbers

# Whitespace Display (show both tabs and spaces)
set whitespace "→·"

# Auto-indentation
set autoindent

# Set the tab stop width to 4 spaces 
set tabsize 4
set tabstospaces

# Enable soft wrapping of lines
set softwrap

# Enable case-insensitive search
set casesensitive

# Show the cursor position
set constantshow

# Show the file browser in full screen
set multibuffer

# Save automatically on exit if no changes were made
set saveonexit

# Set a specific color scheme
set titlecolor brightwhite,blue
set statuscolor brightwhite,green
set errorcolor brightwhite,red
set selectedcolor brightwhite,magenta
set stripecolor ,yellow
set numbercolor cyan
set keycolor cyan
set functioncolor green
```

Save and exit the file (in nano, press `Ctrl+X`, then `Y`, then `Enter`).

## Setup Git

Open or create the Git config file: `nano ~/.gitconfig` and add the following:

```bash
[user]
    name = [username]
    email = [email]
    signingkey = [gpg long key id]

[commit]
    gpgsign = true
    template = ~/.gitmessage.txt

[core]
    sshCommand = ssh -i ~/.ssh/id_ed25519
    editor = /usr/bin/nano
    excludesfile = ~/.gitignore_global
    autocrlf = input
    fileMode = false
    whitespace = trailing-space,space-before-tab,indent-with-non-tab
    pager = less -x4
    sshCommand = ssh -i ~/.ssh/id_ed25519

[url "git@github.com:"]
    insteadOf = https://github.com/

[init]
    defaultBranch = main

[credential]
    helper = store

[color]
    ui = auto

[push]
    default = current

[apply]
    whitespace = fix

[filter "stripwhitespace"]
    clean = perl -pi -e 's/[ \t]+$//'

[pull]
    rebase = true

[filter "lfs"]
    clean = git-lfs clean -- %f
    smudge = git-lfs smudge -- %f
    process = git-lfs filter-process
    required = true

[receive]
    fsckObjects = true

[gpg]
    program = /usr/bin/gpg

[diff]
    tool = vimdiff

[merge]
    tool = vimdiff

[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

Save and exit the file (in nano, press `Ctrl+X`, then `Y`, then `Enter`).

Open or create the .gitignore_global file: `nano ~/.gitignore_global` and add the following:

```bash
# Compiled source
*.com
*.class
*.dll
*.exe
*.o
*.so

# Packages
# it's better to unpack these files and commit the raw source
# git has its own built-in compression methods
*.7z
*.dmg
*.gz
*.iso
*.jar
*.rar
*.tar
*.zip

# Logs and databases
*.log
*.sql
*.sqlite
*.sqlite3

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
Icon?
Thumbs.db
ehthumbs.db
Desktop.ini
.DocumentRevisions-V100
.fseventsd
.TemporaryItems
.Trash-*
.nfs*

# IDEs and editors
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# macOS specific
.DS_Store
.AppleDouble
.LSOverride

# Linux specific
*~

# Python
__pycache__/
*.py[cod]
*.pyo
*.pyd
*.env
*.venv
ENV/
env/
venv/
ENV.bak/
env.bak/
venv.bak/

# Django
*.log
*.pot
*.pyc
__pycache__/
local_settings.py
db.sqlite3
media

# Django specific
*.pot
*.pyc
__pycache__/
local_settings.py
db.sqlite3
media

# PyCharm
.idea/

# VS Code
.vscode/
```

Save and exit the file (in nano, press `Ctrl+X`, then `Y`, then `Enter`).

Open or create the Git config file: `nano ~/.gitmessage.txt` and add the following:

```bash
# Summary (50 characters or less)
# -------------------------------
# Provide a brief summary of the change. This should be a concise
# explanation of the changes being made and their purpose.
# Example: Fix issue with user login by updating validation rules.

# Detailed Description
# --------------------
# Provide a detailed description of the changes. This section can
# include multiple paragraphs explaining the changes, the reason
# behind them, and any relevant background information.
# 
# Example:
# - Fixed issue with user login validation.
# - Updated validation rules to include email format check.
# - Added unit tests to verify new validation rules.
#
# Changes Made
# ------------
# - List the individual changes made as part of this commit.
# - This can be a bulleted or numbered list.
#
# Example:
# 1. Updated login.js to include new validation rules.
# 2. Added test cases to login.test.js.
# 3. Updated documentation to reflect changes.
#
# Issue Tracking
# --------------
# If this commit is related to an issue or ticket, include the reference
# here. This helps in tracking changes related to specific issues.
#
# Example: Closes #123, Relates to #456

# Additional Notes
# ----------------
# Include any additional notes or information that might be useful for
# other developers or for future reference.
#
# Example: This change addresses the immediate issue but further
# refactoring of the validation logic might be needed in the future.

# Guidelines
# ----------
# 1. Use present tense ("Fix issue" not "Fixed issue").
# 2. Capitalize the first letter of the summary.
# 3. Do not end the summary with a period.
# 4. Keep the summary under 50 characters.
# 5. Wrap the body at 72 characters.
```

Save and exit the file (in nano, press `Ctrl+X`, then `Y`, then `Enter`).

## OpenSSH

Generate a new SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`. Replace "<your_email@example.com>" with the
email associated with your GitHub account.

When prompted, press `Enter` to accept the default file location.

Enter a secure passphrase when prompted (recommended).

Open or create the SSH config file: `nano ~/.ssh/config`.

Add the following configuration to the file:

```bash
Host github.com
    HostName github.com
    User git
    AddKeysToAgent yes
    IdentityFile ~/.ssh/id_ed25519
```

Save the file and exit the editor (in nano, press `Ctrl+X`, then `Y`, then `Enter`).

Ensure the correct permissions are set on the config file and key:

```bash
chmod 600 ~/.ssh/config
chmod 600 ~/.ssh/id_ed25519
```

Start the SSH agent: `eval "$(ssh-agent -s)"`.

Add your SSH key to the agent: `ssh-add ~/.ssh/id_ed25519`.

Display your public key: `cat ~/.ssh/id_ed25519.pub` and copy the output.

Go to GitHub in your web browser and navigate to Settings > SSH and GPG keys.

Click "New SSH key", give it a title (e.g., "EC2 Instance"), and paste your public key.

Click "Add SSH key" to save.

Your EC2 instance is now set up with an SSH key for GitHub. You can test the connection with: `ssh -T git@github.com`.

## GNUPG

Here are the instructions to create a GPG key for GitHub on your EC2 instance:

Generate a new GPG key: `gpg --full-generate-key`.

Choose RSA and RSA (default) when prompted.

Select 4096 bits for key size.

Enter an expiration date or choose no expiration.

Enter your name and email associated with your GitHub account.

Enter a secure passphrase.

List your GPG keys to get the key ID: `gpg --list-secret-keys --keyid-format LONG`.

Export your GPG public key: `gpg --armor --export YOUR_KEY_ID`.

Copy the output, starting from "-----BEGIN PGP PUBLIC KEY BLOCK-----" to "-----END PGP PUBLIC KEY BLOCK-----".

Go to GitHub in your browser, navigate to Settings > SSH and GPG keys.

Click "New GPG key", paste your public key, and save.

Your EC2 instance is now set up with a GPG key for GitHub commit signing. You can test it by making a signed commit:
`git commit -S -m "Your commit message"`.

Sending your GPG public key to a public keyserver is a good practice. It makes it easier for others to find and use your
public key for encryption or verification purposes. You can upload your key to a popular keyserver like keys.openpgp.org
or keyserver.ubuntu.com using the commands:

```bash
gpg --keyserver keys.openpgp.org --send-keys YOUR_KEY_ID
gpg --keyserver keyserver.ubuntu.com --send-keys YOUR_KEY_ID
gpg --keyserver keys.gnupg.net --send-keys YOUR_KEY_ID
```

This step enhances the accessibility and usability of your GPG key, especially when collaborating with others or
verifying your signed commits on platforms like GitHub.

Open or create the gpg config file: `nano ~/.gnupg/gpg.conf` and add the following:

```bash
auto-key-retrieve
no-emit-version
use-agent
pinentry-mode loopback
```

Save and exit the file (in nano, press `Ctrl+X`, then `Y`, then `Enter`).

Open or create the gpg-agent config file: `nano ~/.gnupg/gpg-agent.conf` and add the following:

default-cache-ttl 32400
max-cache-ttl 32400
enable-ssh-support

Save and exit the file (in nano, press `Ctrl+X`, then `Y`, then `Enter`).

## Bash

Open add the following to the bottom of the Bash config file using the command: `nano ~/.bashrc`

```bash
# Set PATH to prioritize Snap installations
export PATH=/snap/bin:$PATH

# Set nano as the default editor
export EDITOR=nano
export VISUAL=nano

# Adding Austrlian English with UTF-8 locale
export LC_ALL=en_AU.UTF-8
export LANG=en_AU.UTF-8
export LANGUAGE=en_AU.UTF-8
export LC_TIME=en_AU.UTF-8
export LC_NUMERIC=en_AU.UTF-8
export LC_MONETARY=en_AU.UTF-8
export LC_PAPER=en_AU.UTF-8
export LC_NAME=en_AU.UTF-8
export LC_ADDRESS=en_AU.UTF-8
export LC_TELEPHONE=en_AU.UTF-8
export LC_MEASUREMENT=en_AU.UTF-8
export LC_IDENTIFICATION=en_AU.UTF-8
export LC_MESSAGES=en_AU.UTF-8
export LC_COLLATE=en_AU.UTF-8
export LC_CTYPE=en_AU.UTF-8

# Set timezone
export TZ='Australia/Perth'

# SSH agent setup
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# GPG agent setup with forwarding
export GPG_TTY=$(tty)
if [ -S "${HOME}/.gnupg/S.gpg-agent" ]; then
    export GPG_AGENT_INFO="${HOME}/.gnupg/S.gpg-agent"
else
    eval "$(gpg-agent --daemon)"
fi
gpg-connect-agent updatestartuptty /bye >/dev/null

# Enable bash completion for git
if [ -f /usr/share/bash-completion/completions/git ]; then
    . /usr/share/bash-completion/completions/git
fi

# Set up a more informative prompt
export PS1='\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
```

Save and exit the file (in nano, press `Ctrl+X`, then `Y`, then `Enter`).

The restart Bash with: `source ~/.bashrc`.

## Clone the ECMS GitHub Repository

`git clone git@github.com:enveng-group/ecms.git`

### ONLY for Development

`git checkout dev`

For Production, do nothing as the repository will clone "main".

## Developing the Django Application

```bash

mkdir ecms
cd ecms
sudo apt install python3-venv
python3 -m venv ~/.venv/ecms
source ~/.venv/ecms/bin/activate
pip install Django
django-admin startproject ecms

```

For the AWS security group, you need to add an inbound rule:

```md

Type: Custom TCP
Port Range: 8000
Source: Your IP address or 0.0.0.0/0 (less secure, allows all)

```

For your EC2 instance, you should add both your public IP and public DNS to the ALLOWED_HOSTS list in your Django
settings.py file. Here's how you can update it:

```json

ALLOWED_HOSTS = [
  '3.27.66.130',
  'ec2-3-27-66-130.ap-southeast-2.compute.amazonaws.com',
  'localhost',
  '127.0.0.1'
]

```

In your settings.py, locate the LANGUAGE_CODE setting and change it to `LANGUAGE_CODE = 'en-au'` to set the language to
Australian English.

In your settings.py, locate the TIME_ZONE setting and change it to: `TIME_ZONE = 'Australia/Perth'`. This sets your
project to use the Perth time zone.

Add the following line to your settings.py: `STATIC_ROOT = BASE_DIR / 'staticfiles'` to configure Django to collect
static files into a 'staticfiles' directory at your project's base.

After adding STATIC_ROOT, you can collect static files using: `python manage.py collectstatic` when you're ready to
deploy or test static file serving.

The 'python manage.py collectstatic' command performs several important functions:

- It creates the 'staticfiles' directory if it doesn't already exist.
- It gathers all static files from your various apps and any directories you've specified in STATICFILES_DIRS.
- It copies these files into the STATIC_ROOT directory ('staticfiles' in this case).
- It organizes the files in a structure that's efficient for serving in a production environment.
- This process is crucial for deployment because it centralizes all your static files in one location, making it easier
  for a web server like Nginx or Apache to serve these files directly, reducing the load on your Django application.

Running this command is typically part of the deployment process, but it's also useful during development to ensure all
your static files are being collected correctly.

To set up Django's built-in documentation tool, follow these steps to add 'django.contrib.admindocs' to your
INSTALLED_APPS in settings.py:

```json

INSTALLED_APPS = [
  ...
  'django.contrib.admindocs',
  ...
]

```

Add the admin documentation URL pattern to your project's urls.py file:

```python


from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/doc/', include('django.contrib.admindocs.urls')),
    path('admin/', admin.site.urls),
    ...
]

```

Install docutils, which is required for the admindocs: `pip install docutils`

To set up django-debug-toolbar, follow these steps to install django-debug-toolbar: `pip install django-debug-toolbar`.

Add 'debug_toolbar' to your INSTALLED_APPS in settings.py:

```json


INSTALLED_APPS = [
  ...
  'debug_toolbar'
]

```

Add the debug toolbar middleware to your MIDDLEWARE setting in settings.py:

```json

MIDDLEWARE = [
  ...
  'debug_toolbar.middleware.DebugToolbarMiddleware'
]

```

For an AWS EC2 instance, you'll need to adjust the INTERNAL_IPS setting. Instead of using a static IP, you can
dynamically set it based on the EC2 instance's IP. Add this to the top of your settings.py:

```json

import socket

hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
INTERNAL_IPS = [ip[: -1] + '1' for ip in ips]
INTERNAL_IPS.append('127.0.0.1')

```

This code will automatically detect the EC2 instance's IP and add it to INTERNAL_IPS, ensuring the debug toolbar works
correctly in your AWS environment.

Add the debug toolbar URLs to your project's urls.py:

```python


from django.urls import include, path
import debug_toolbar

urlpatterns = [
    ...
    path('__debug__/', include(debug_toolbar.urls)),
]

```

Ensure `DEBUG = True` in your settings.py.

Now, when you run your development server and access your site from 127.0.0.1, you'll see the debug toolbar on the right
side of your pages. It provides valuable information about queries, templates, HTTP headers, and more.

Run `pip freeze > requirements.txt` in your project's virtual environment. This captures all installed packages. To
update your requirements.txt file as your project develops, you simply need to re-run the command you chose. This will
generate a fresh requirements.txt that reflects the current state of your project's dependencies. It's a good practice
to update your requirements.txt regularly, especially after adding new packages or before committing changes to version
control.

To set up a superuser in your Django project, run the following command: `python manage.py createsuperuser`.

You'll be prompted to enter a username, email address, and password for the superuser. Follow the prompts, providing the
required information. Once completed, you'll see a message confirming that the superuser was created successfully. You
can now use these credentials to log in to the Django admin interface at '/admin/'. This superuser account will have
full access to manage your Django application through the admin panel.

```python

python manage.py check
python manage.py makemigrations
python manage.py migrate
python manage.py make
python manage.py runserver 0.0.0.0:8000

```

`cd ecms/ecms`
`python manage.py startapp dashboard`

```python
# ecms/dashboard/views.py

from django.shortcuts import render

def dashboard(request):
    context = {'message': 'Welcome to the dashboard'}
    return render(request, 'dashboard/index.html', context)

```

TODO: HTML5BiolerPlate integration before i create the index.html

## Roadmap and Feature Wishlist

### High Priority

- [ ] Go through additional items in old.readme.md for essential items
- [ ] Replace UFW apt with UFW snap
- [ ] Apparmour
- [ ] AntiVirus Malware

### Medium Priority

- [ ] Setting up and using AWS-CLI
- [ ] Launching a Production Environment
- [ ] Setup SSH
- [ ] Setup GPG
- [ ] Deploy key in Github
- [ ] Visual Studio Code Settings / editorconfig file

### Low Priority

- [ ] Connect to EC2 via SSH
- [ ] Docker and Containers
    - [ ] Setting up Docker
    - [ ] Docker Containers
- [ ] Additional Software Essentials in Production
- [ ] Cloudflare Warp
- [ ] Hashicorp Vault

### Development Tasks

#### Documentation

- [ ] AWS-CLI setup and usage guide
- [ ] Production environment launch guide
- [ ] SSH setup instructions
- [ ] GPG setup guide
- [ ] VS Code configuration best practices

#### Implementation

- [ ] Create editorconfig file
- [ ] Develop Docker setup scripts
- [ ] Compile list of essential production software

### Research

- [ ] Evaluate Snapcraft packaging process
- [ ] Investigate UFW snap vs apt differences
- [ ] Explore best practices for EC2 SSH connections

### Completed Features

- [x] Initial project setup
- [x] Basic README structure
