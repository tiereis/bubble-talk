# users/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, ProfileSerializer
from .models import Profile, Follow

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile, created = Profile.objects.get_or_create(user=user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        profile = Profile.objects.get(user=user)
        
        # O DRF precisa de um serializer para processar a requisição
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            # Atualiza apenas os campos do perfil (foto)
            if 'profile_picture' in request.data:
                profile.profile_picture = request.data['profile_picture']
                profile.save()

            # Atualiza o nome de usuário ou e-mail se eles estiverem na requisição
            if 'username' in request.data:
                user.username = request.data['username']
            if 'email' in request.data:
                user.email = request.data['email']
            
            # TODO: Adicione lógica para a senha aqui, se necessário.
            # O ideal é um endpoint separado para segurança.
            
            user.save()
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class FollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        # Encontra o usuário que será seguido
        followed = get_object_or_404(User, id=user_id)
        follower = request.user

        # Evita que o usuário se siga
        if follower == followed:
            return Response({"detail": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # Tenta criar a relação de follow
        follow, created = Follow.objects.get_or_create(follower=follower, followed=followed)

        if created:
            return Response({"detail": f"You are now following {followed.username}."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"detail": f"You are already following {followed.username}."}, status=status.HTTP_200_OK)

    def delete(self, request, user_id):
        # Encontra a relação de follow e a deleta
        followed = get_object_or_404(User, id=user_id)
        follower = request.user
        
        try:
            follow = Follow.objects.get(follower=follower, followed=followed)
            follow.delete()
            return Response({"detail": f"You have unfollowed {followed.username}."}, status=status.HTTP_204_NO_CONTENT)
        except Follow.DoesNotExist:
            return Response({"detail": "You are not following this user."}, status=status.HTTP_404_NOT_FOUND)