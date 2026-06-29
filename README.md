# PawCare Animal Clinic Website

A responsive veterinary clinic website for PawCare Animal Clinic in San Jose del Monte, Bulacan.

## Website sections

- Home and clinic visit information
- About PawCare
- Veterinary services
- Why choose PawCare
- Clinic environment
- Veterinarian profile
- Client feedback
- Frequently asked questions
- Phone, email, hours, and location

## Project structure

- `VetWorks/` contains the Blazor website.
- `docs/` contains the matching standalone site used by GitHub Pages.
- `VetWorks/Components/Pages/Home.razor` contains the main page content.
- `VetWorks/wwwroot/app.css` and `docs/site.css` contain the responsive visual styles.

The website uses styled media areas until approved clinic photographs are available. Contact actions open the visitor's phone or email app; there is no online booking service, database, login, payment flow, or external API.

## Run locally

```powershell
dotnet run --project VetWorks\VetWorks.csproj
```

## Build

```powershell
dotnet build VetWorks.slnx -c Release
```
