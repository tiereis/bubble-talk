# users/urls.py

from django.urls import path
from .views import RegisterView, ProfileView, FollowView, UserListView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', obtain_auth_token, name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('follow/<int:user_id>/', FollowView.as_view(), name='follow-user'),
    path('list/', UserListView.as_view(), name='user-list'),
]