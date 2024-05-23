import datetime
import json
import os
import subprocess

filename = 'data.json'

# Colourise command line output
class background:
    Black= '\033[48;5;0m'
    Red= '\033[48;5;1m'
    Green= '\033[48;5;2m'
    Yellow= '\033[48;5;3m'
    Blue= '\033[48;5;4m'
    Magenta= '\033[48;5;5m'
    Cyan= '\033[48;5;6m'
    White= '\033[48;5;7m'

class foreground:
    white='\033[39m'
    black='\033[30m'
    yellow='\033[93m'
    pink='\033[95m'
    red='\033[91m'
    green='\033[92m'
    cyan='\033[96m'
    purple='\033[94m'
    lightgrey='\033[37m'
    darkgrey='\033[90m'

reset_color="\033[0m"


def create_data():
    # To add a custom date to each post
    while True:
      date = input("Enter date (numeric values i.e 01.01.24) or press Enter for today's date: \n")

      if date.strip():
          if len(date) <= 10:
              break
          else:
              print("Date must be 10 characters or fewer. Please try again.")
      else:
          # If the user didn't input a date, set it to today's date
          date = datetime.datetime.now().strftime("%d.%m.%Y")
          break

    # REPLACES THE ABOVE
    # Add todays date automatically
    # date = datetime.datetime.now().strftime("%d.%m.%Y")

    # Make the title mandatory
    while True:
        title = input("Enter a title: ")
        if title.strip(): # Check title is not empty/only contains whitespace
            break
        else:
            print("\nTitle cannot be empty. Please try again.")

    image = input("Enter the image url: ")
    authorName = input("Enter the authorName: ")
    authorLink = input("Enter an authorLink URL: ")

    para = input("Enter paragraph text: ")
    
    highlightWords = input(f"Type the word/s you want {background.Yellow}{foreground.black}highlighted?{reset_color}: ")

    paraLinkWord = input("Enter ONE paragraph WORD to add a link to: ")
    paraLink = input(f"Enter a link URL for {paraLinkWord}: ")

    new_data = {
        'title': title,
        'image': image,
        'date': date,
        'authorName': authorName,
        'authorLink': authorLink,
        'para': para,
        'highlightWords': highlightWords,
        'paraLinkWord': paraLinkWord,
        'paraLink': paraLink
    }

    return new_data

def load_existing_data(filename):
    existing_data = []
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            existing_data = json.load(file)
    return existing_data

def save_to_json(data, filename=filename):
    existing_data = load_existing_data(filename)
    existing_data.insert(0, data)  # Insert new data at the top of the file

    with open(filename, 'w') as file:
        json.dump(existing_data, file, indent=2)

def git_add_commit_push(commit_message):
    subprocess.run(['git', 'add', filename])
    subprocess.run(['git', 'commit', '-m', commit_message])
    subprocess.run(['git', 'push'])

if __name__ == "__main__":

    while True:
        new_data = create_data()

        save_to_json(new_data)
        print(f"\nAll data has been saved to the json file {filename}.\n")

        # Prompt user for Git operations
        git_prompt = input("Would you like to add, commit, and push to the Git repository? \n(Press y or enter to quit.): \n")

        if git_prompt.lower() == 'y':
            commit_message = input("Enter a commit message: ")
            git_add_commit_push(commit_message)
            print("\nGit operations completed successfully. \n\nGreat job!")
        else:
            print("\nExiting the program without Git operations. \n\nSee you next time!")
        break
