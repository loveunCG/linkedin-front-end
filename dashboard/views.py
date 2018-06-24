import json

from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views.generic.base import TemplateView
from django.views.generic.list import ListView
from django.template import loader
import requests


from app.models import LinkedInUser, BotTask


# from django.shortcuts import render
login_decorators = (login_required, )


@method_decorator(login_decorators, name="dispatch")
class DashBoard(ListView):
    template_name = 'dashboard/home.html'
    model = LinkedInUser

    def get_queryset(self):
        qs = super(DashBoard, self).get_queryset()
        return qs

    def post(self, request):
        print(request.POST)
        id_ = request.POST['id']
        ip = request.POST['ip']
        linkedin_user = LinkedInUser.objects.get(id=id_)
        linkedin_user.bot_ip = ip
        linkedin_user.save()
        return redirect('dashboard')


@method_decorator(login_decorators, name="dispatch")
class Proxy(TemplateView):
    def get_context_data(self, **kwargs):
        ctx = super(Proxy, self).get_context_data()
        print('path:', self.kwargs)
        linkedin = LinkedInUser.objects.get(pk=self.kwargs.get('pk'))
        ip = linkedin.bot_ip
        rpath = '/'
        if 'log' in self.request.path:
            rpath = '/logs/'
        url = 'http://{ip}:8080{path}'.format(ip=ip, path=rpath)
        print('rurl:', url)
        res = requests.get(url)
        ctx['data'] = res.json()
        # print('context:', ctx)
        return ctx

    @staticmethod
    def check_bot_status(request, pk):
        linkedin = LinkedInUser.objects.get(pk=pk)
        ip = linkedin.bot_ip
        rpath = '/'
        url = 'http://{ip}:8080{path}'.format(ip=ip, path=rpath)
        print('url:', url)
        try:
            res = requests.get(url, timeout=3)
            res = res.json()
        except requests.exceptions.Timeout:
            res = {'status': False}

        except Exception as e:
            print('error--->:', e)
            res = {'status': False}
        return JsonResponse(res)

    @staticmethod
    def get_linkedin_user_list(request):
        send_data = []
        try:
            user = request.user
            linkedin_user = LinkedInUser.objects.filter(user_id=user)
            url = '/dashboard/bot_log/'
            index = 0
            for linked_user in linkedin_user:
                if linked_user.login_status:
                    activate = '<button class="btn btn-sm btn-primary btn-gradient waves-effect waves-light activat-button">Active</button>'
                else:
                    activate = '<button class="btn btn-sm btn-info btn-gradient waves-effect waves-light activat-button">InActive</button>'
                if linked_user.bot_ip:
                    if Proxy.__check_bot_status(linked_user.id) is not False:
                        action = '<a class="btn btn-sm btn-success btn-gradient waves-effect waves-light activat-button" href="' + url + str(
                            linked_user.id) + '">bot running</a>'
                    else:
                        action = '<a class="btn btn-sm btn-danger btn-gradient waves-effect waves-light activat-button">bot stoped</a>'
                else:
                    action = '<button class="btn btn-sm btn-primary btn-gradient waves-effect waves-light activat-button" onclick="add_ip('+str(linked_user.id)+', 1)">Add Ip</button>'

                index += 1
                send_data.append({
                    'user': linked_user.id,
                    'email': linked_user.email,
                    'activate': activate,
                    'status': activate,
                    'action': action,
                    'bot_ip': linked_user.bot_ip,
                    'index': index
                })
        except LinkedInUser.DoesNotExist:
            send_data = []
        data = {'data': send_data}
        return JsonResponse(data)

    @staticmethod
    def update_status(request):
        message = ''
        response_code = 0
        try:
            if request.POST.get('linked_id'):
                linked_user = LinkedInUser.objects.filter(id=int(request.POST.get('linked_id')))
                linked_user.update(login_status=int(request.POST.get('status')))
                print(int(request.POST.get('linked_id')))
                if int(request.POST.get('status')) == 1:
                    message = 'Activated Successfully!'
                else:
                    message = 'Disactivated successfully!'
                response_code = 1
            else:
                message = 'Join error!'
        except LinkedInUser.DoesNotExist:
            message = 'Update error!'
        return JsonResponse({'message': message, 'response_code': response_code, 'data': '' })

    @staticmethod
    def __check_bot_status(pk):
        linkedin = LinkedInUser.objects.get(pk=pk)
        ip = linkedin.bot_ip
        rpath = '/'
        url = 'http://{ip}:8081{path}'.format(ip=ip, path=rpath)
        print('url:', url)
        res = False
        try:
            requests.get(url, timeout=3)
            res = True
        except requests.exceptions.Timeout:
            pass

        except Exception as e:
            print('error--->:', e)
            pass
        return res

    @staticmethod
    def update_ip(request):
        message = ''
        response_code = 0
        try:
            if request.POST.get('linked_id'):
                linked_user = LinkedInUser.objects.filter(id=int(request.POST.get('linked_id')))
                linked_user.update(bot_ip=str(request.POST.get('ip')))
                message = 'Add Ip successfully!'
                response_code = 1
            else:
                message = 'Update error!'
        except LinkedInUser.DoesNotExist:
            message = 'Update error!'
        return JsonResponse({'message': message, 'response_code': response_code})

    def render_to_response(self, context, **response_kwargs):
        json_data = json.dumps(context['data'])
        return HttpResponse(json_data, content_type='application/json')

    @staticmethod
    def bot_list(request, pk):
        linkedin_user = LinkedInUser.objects.get(pk=pk)
        bot_tasks = BotTask.objects.filter(owner=linkedin_user)
        send_data = []
        for bot_task in bot_tasks:
            send_data.append({
                "id": bot_task.id,
                "task_type": bot_task.task_type,
                "name": bot_task.name,
                "status": bot_task.status,
                "completed_date": bot_task.completed_date.strftime('%b/%d/%Y %H:%M %p')
            })
        return JsonResponse({'data': send_data})

    @staticmethod
    def bot_list_view(request, pk):
        template = loader.get_template('dashboard/bot_list.html')
        linkedin_user = LinkedInUser.objects.get(pk=pk)
        content = {
            'linkedin_account': linkedin_user,
        }
        return HttpResponse(template.render(content, request))



