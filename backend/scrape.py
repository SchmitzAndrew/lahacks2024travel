from utils import scrape_website
import pyperclip

url = input('Enter website url')
# print(scrape_website(url))
pyperclip.copy(scrape_website(url))