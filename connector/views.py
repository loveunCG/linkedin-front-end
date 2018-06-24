from django.http import HttpResponse
from django.shortcuts import render, redirect
from . forms import SearchForm
from . models import Search, SearchResult, ConnectorCampaign
from app.models import User

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.common.exceptions import *
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options

from getpass import getpass
import sys
import re
import time
from datetime import datetime


def search(request):
    if request.method == 'POST':
        data = request.POST
        print("pass form is valid")
        searchday = datetime.now()
        searchname = data.get('search_name')
        keyword = data.get('keyword')
        print(searchname)
        print(keyword)
        user = User.objects.all()
        user_account = user.get(email='va.jin1125@hotmail.com')
        user_email = user_account.email
        user_password = user_account.password

        driver = webdriver.Firefox(executable_path='D:\SQTechnology\Projects\development\geckodriver.exe')
        driver.get("https://www.linkedin.com/")
        wait = WebDriverWait(driver, 5)

        email = wait.until(EC.visibility_of_element_located(
            (By.CSS_SELECTOR, "input#login-email")))
        password = wait.until(EC.visibility_of_element_located(
            (By.CSS_SELECTOR, "input#login-password")))
        signin_button = wait.until(EC.visibility_of_element_located(
            (By.CSS_SELECTOR, "input#login-submit")))

        email.clear()
        password.clear()

        email.send_keys(user_email)
        password.send_keys(user_password)

        signin_button.click()
        print("----------click sign in----------------")

        actor_name_list = ""
        # Save search name and keyword
        search_save = Search(search_name=searchname, keyword=keyword, resultcount=actor_name_list, searchdate=searchday)
        search_save.save()

        search = Search.objects.all()
        search_pan = search.get(search_name=searchname)
        print (searchname)
        search_id = search_pan.id
        print(search_id)

        # search connection
        search_input = driver.find_element_by_xpath("/html/body/nav/div/form/div/div/div/artdeco-typeahead-deprecated/artdeco-typeahead-deprecated-input/input")
        search_input.clear()
        search_input.send_keys(keyword)
        search_input.send_keys(Keys.ENTER)
        print("-------click search button-----------")

        for i in range(2):
            time.sleep(5)
            driver.execute_script("window.scrollBy(0, 1000);")
            time.sleep(5)

            actor_name_lists = driver.find_elements_by_class_name("actor-name")
            actor_title_company_lists = driver.find_elements_by_class_name("subline-level-1")
            actor_location_lists = driver.find_elements_by_class_name("subline-level-2")

            for search_index in range(len(actor_name_lists)):
                actor_name_list = actor_name_lists[search_index]
                actor_name = actor_name_list.text
                actor_title_company = actor_title_company_lists[search_index].text
                actor_company = ""
                actor_title = ""
                if " at " in actor_title_company:
                    title_company = actor_title_company.split(" at ")
                    actor_title = title_company[0]
                    actor_company = title_company[1]
                else:
                    actor_title = actor_title_company
                actor_location = actor_location_lists[search_index].text
                search_count = search_index + 1

                print (actor_name, actor_company, actor_title, actor_location)
                
                search_result = SearchResult(searchid=search_id, name=actor_name, company=actor_company, title=actor_title, location=actor_location)
                result_list = [search_result]
                SearchResult.objects.bulk_create(result_list)
                # search_result.save()

            driver.find_element_by_class_name("next").click()

        return redirect('index')
    else:
        form = SearchForm()
    return render(request, 'connector/search.html', {'form': form})


def connector(request):
    return render(request, 'connector/connector.html')


def create_connector(request):
    # Get the connector names for copying
    connector_list = ConnectorCampaign.objects.all()
    connector_name_list = []
    for connector in connector_list:
        exist_connector_name = connector.connector_name
        connector_name_list.append(exist_connector_name)
    
    # Post form request
    if request.method == 'POST':
        data = request.POST
        connector_name = data.get('connector_name')
        copy_connector_name = data.get('copy_connector_name')
        if len(copy_connector_name) != 0:    
            copy_connector_filter = connector_list.get(connector_name=copy_connector_name)
            copy_connector_id = copy_connector_filter.id
        else:
            copy_connector_id = 0
        user = User.objects.all()
        user_account = user.get(email='va.jin1125@hotmail.com')
        created_by_id = user_account.id
        created_at = datetime.now()
        connector_status = 1

        connector_save = ConnectorCampaign(connector_name=connector_name, copy_connector_id=copy_connector_id, created_by_id=created_by_id, created_at=created_at, status=connector_status)
        connector_save.save()

        return redirect('../connector')

    return render(request, 'connector/create_connector.html', {'connector_name_list':connector_name_list})

