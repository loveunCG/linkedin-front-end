# -*- coding: utf-8 -*-
"""
Created on Mon Apr 23 17:06:14 IST 2018

@author: Chetna
"""

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.common.exceptions import *
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pyvirtualdisplay import Display

# sudo apt-get install xvfb xserver-xephyr : we need to install that

from getpass import getpass
import sys
import re
import time


def exist_user():
    try:
        error_span = wait.until(EC.visibility_of_element_located((By.ID, "session_key-login-error")))
        no_exist_user_alert = error_span.text
        print (no_exist_user_alert)
        return False
    except Exception as e:
        login_success_desc = 'Login successful! that is an existing user.'
        print(login_success_desc)
        return True


def compose_new_message(driver, message):
    driver.get("https://www.linkedin.com/messaging/compose/")
    wait = WebDriverWait(driver, 5)

    lookup_input_box = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input.msg-connections-lookup__search-field.msg-connections-lookup__search-field--no-recipients")))

    print("------pass lookup_input_box---------")

    lookup_input_box.clear()
    lookup_input_box.send_keys('s')

    time.sleep(5)

    select_result_button = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "button.display-flex.flex-row.align-items-center.msg-connections-lookup__search-result.msg-connections-lookup__search-result--selected")))

    select_result_button.click()

    time.sleep(5)

    send_message(driver, message)


def get_message_contract_list(driver):
    driver.get("https://www.linkedin.com/messaging/")
    wait = WebDriverWait(driver, 5)

    try:
        contract_a_elements = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a.msg-conversation-listitem__link.msg-conversations-container__convo-item-link")))
        return contract_a_elements
    except Exception as e:
        print("Exception[get_message_contract_list] %s" % e.message)
        return None


def select_message_send_contract(driver, contract_a_elements):
    try:
        messaging_link = contract_a_elements[0].get_attribute('href') # For I have set 1st contract 
        driver.get(messaging_link)
    except Exception as e:
        print("Exception[select_message_send_contract] %s" % e.message)
        return None


def send_message(driver, message):
    wait = WebDriverWait(driver, 10)
    try:
        message_textbox = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "textarea.ember-text-area.msg-form__textarea")))
        print("------pass message_textbox---------")

        message_textbox.clear()
        message_textbox.send_keys(message)
        
        send_button = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "button.msg-form__send-button.button-primary-small")))
        print("------pass send_button---------")

        send_button.click()
    except Exception as e:
        print("Exception[send_message] %s" % e.message)
        return None


def get_profile_info(driver, profile_url):
    response = {
        'profile_url' : profile_url,
        'name' : '',
        'title' : '',
        'location' : '',
        'company' : '',
    }
    driver.get(profile_url)
    wait = WebDriverWait(driver, 5)

    try:
        name = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "h1.pv-top-card-section__name"))).text
        response['name'] = name
        title = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "h2.pv-top-card-section__headline"))).text
        response['title'] = title
        location = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "h3.pv-top-card-section__location"))).text
        response['location'] = location
        company = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "span.lt-line-clamp__line.lt-line-clamp__line--last"))).text
        response['company'] = company
    except Exception as e:
        print("Exception[get_profile_info] %s" % e.message)
    return response


def get_connector_contacts(driver):
    driver.get("https://www.linkedin.com/mynetwork/invite-connect/connections/")
    wait = WebDriverWait(driver, 5)
    contracts_list = []
    contracts_a_href = []

    try:
        contract_a_elements = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a.mn-connection-card__link.ember-view")))
    except Exception as e:
        print("Exception[get_connector_contacts] %s" % e.message)
        return []

    for contract_a_element in contract_a_elements:
        contracts_a_href.append(contract_a_element.get_attribute('href'))

    for contract_a_href in contracts_a_href:
        contracts = get_profile_info(driver, contract_a_href)
        contracts_list.append(contracts)
    print(contracts_list)
    return contracts_list


def login_linkedIn(user_email, user_password):
    Display(visible=0).start()
    driver = webdriver.Firefox()
    driver.get("https://www.linkedin.com")
    wait = WebDriverWait(driver, 5)

    print("----working-----")

    email = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input#login-email")))
    print("------pass email---------")

    password = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input#login-password")))
    print("------pass password---------")

    signin_button = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "input#login-submit")))
    print("------pass button---------")

    email.clear()
    password.clear()

    email.send_keys(user_email)
    password.send_keys(user_password)

    signin_button.click()
    print("----------click sign in----------------")

    if exist_user():
        return driver
        print("That user is an existing user.")
    else:
        return None
        print("That user is not exist in Linkedin.")


if __name__ == '__main__':
    
    user_email = raw_input("Enter email address:")
    user_password = getpass("Enter password:")
    # user_message = raw_input("Enter message:")

    driver = login_linkedIn(user_email, user_password)

    get_connector_contacts(driver)

    # compose_new_message(driver, user_message)    

    # contract_a_elements = get_message_contract_list(driver)
    # if contract_a_elements:
    #     select_message_send_contract(driver, contract_a_elements)
    #     send_message(driver, user_message)
