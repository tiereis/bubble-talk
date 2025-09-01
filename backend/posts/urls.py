# posts/urls.py

from django.urls import path
from .views import PostListCreateView, NewsFeedView, CommentListCreateView, LikeView

urlpatterns = [
    path('all/', PostListCreateView.as_view(), name='post-list-create'),
    path('feed/', NewsFeedView.as_view(), name='news-feed'),
    path('<int:post_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('<int:post_id>/like/', LikeView.as_view(), name='like-post'),
]