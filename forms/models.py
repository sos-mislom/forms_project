from django.db import models

class Form(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

class Question(models.Model):
    form = models.ForeignKey(Form, on_delete=models.CASCADE)
    text = models.TextField()

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.TextField()
