from django.urls import path
from apps.content.views import (
    DisciplineListView,
    PortfolioListView,
    PortfolioDetailView,
    ReelListView,
    ReelDetailView,
    JournalListView,
    JournalDetailView,
    ServicesView,
    AboutView,
    SiteView,
    HomeView,
)

urlpatterns = [
    path('disciplines/', DisciplineListView.as_view(), name='discipline_list'),
    path('portfolio/', PortfolioListView.as_view(), name='portfolio_list'),
    path('portfolio/<slug:slug>/', PortfolioDetailView.as_view(), name='portfolio_detail'),
    path('reels/', ReelListView.as_view(), name='reel_list'),
    path('reels/<slug:slug>/', ReelDetailView.as_view(), name='reel_detail'),
    path('journal/', JournalListView.as_view(), name='journal_list'),
    path('journal/<slug:slug>/', JournalDetailView.as_view(), name='journal_detail'),
    path('services/', ServicesView.as_view(), name='services_detail'),
    path('about/', AboutView.as_view(), name='about_detail'),
    path('site/', SiteView.as_view(), name='site_detail'),
    path('home/', HomeView.as_view(), name='home_detail'),
]
