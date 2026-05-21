import pygame
import sys

# Initialize Pygame
pygame.init()

# Screen setup
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Kisan AI Background Animation")

# Create background image surface
background_surface = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT))

# Colors (Agricultural theme)
SKY_BLUE = (135, 206, 235)          # Light blue sky
GRASS_GREEN = (34, 89, 52)          # Dark green grass
LIGHT_GREEN = (76, 175, 80)         # Light green field
FIELD_GREEN = (46, 125, 50)         # Field green
GOLD = (255, 193, 7)                # Golden sun
WHITE = (255, 255, 255)
BROWN = (139, 69, 19)               # Soil brown

# Draw gradient sky
for y in range(SCREEN_HEIGHT // 2):
    ratio = y / (SCREEN_HEIGHT // 2)
    r = int(255 * (1 - ratio) + 135 * ratio)
    g = int(255 * (1 - ratio) + 206 * ratio)
    b = int(255 * (1 - ratio) + 235 * ratio)
    pygame.draw.line(background_surface, (r, g, b), (0, y), (SCREEN_WIDTH, y))

# Draw sun
pygame.draw.circle(background_surface, GOLD, (650, 100), 50)
pygame.draw.circle(background_surface, (255, 215, 0), (650, 100), 45)

# Draw clouds
def draw_cloud(surface, x, y):
    pygame.draw.circle(surface, WHITE, (x, y), 20)
    pygame.draw.circle(surface, WHITE, (x + 20, y), 25)
    pygame.draw.circle(surface, WHITE, (x + 40, y), 20)

draw_cloud(background_surface, 100, 80)
draw_cloud(background_surface, 550, 120)

# Draw field with rows
field_start_y = SCREEN_HEIGHT // 2
pygame.draw.rect(background_surface, LIGHT_GREEN, (0, field_start_y, SCREEN_WIDTH, SCREEN_HEIGHT // 3))
pygame.draw.rect(background_surface, FIELD_GREEN, (0, field_start_y + SCREEN_HEIGHT // 3, SCREEN_WIDTH, SCREEN_HEIGHT // 3))

# Draw field texture (crop rows)
for x in range(0, SCREEN_WIDTH + 40, 40):
    pygame.draw.line(background_surface, GRASS_GREEN, (x, field_start_y), (x - 20, SCREEN_HEIGHT), 2)

# Draw some distant trees/vegetation
for tree_x in [100, 300, 500, 700]:
    pygame.draw.polygon(background_surface, GRASS_GREEN, [
        (tree_x, field_start_y + 50),
        (tree_x - 30, field_start_y + 100),
        (tree_x + 30, field_start_y + 100)
    ])

# Save background image
try:
    pygame.image.save(background_surface, "kisan_ai_background.png")
    print("✓ Background image created: kisan_ai_background.png")
except Exception as e:
    print(f"✗ Error saving background: {e}")

# Animation variables
x, y = 100, 300
dx, dy = 2, 2
glow_radius = 30

# Colors for animation
green = (0, 255, 0)
bright_green = (76, 175, 80)
white = (255, 255, 255)

clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

# Main loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                running = False

    # Draw background
    screen.blit(background_surface, (0, 0))

    # Animate a glowing circle (AI effect)
    # Outer glow
    pygame.draw.circle(screen, bright_green, (x, y), glow_radius + 10, 3)
    # Main circle
    pygame.draw.circle(screen, green, (x, y), glow_radius)
    # Inner glow
    pygame.draw.circle(screen, white, (x, y), glow_radius // 2)

    # Move circle
    x += dx
    y += dy

    # Bounce effect
    if x <= glow_radius or x >= SCREEN_WIDTH - glow_radius:
        dx = -dx
    if y <= glow_radius or y >= SCREEN_HEIGHT - glow_radius:
        dy = -dy

    # Draw title
    title = font.render("Kisan AI - Agricultural Assistant", True, WHITE)
    title_bg = pygame.Surface((title.get_width() + 20, title.get_height() + 10))
    title_bg.set_alpha(180)
    title_bg.fill((0, 0, 0))
    screen.blit(title_bg, (SCREEN_WIDTH // 2 - title.get_width() // 2 - 10, 20))
    screen.blit(title, (SCREEN_WIDTH // 2 - title.get_width() // 2, 25))

    # Update display
    pygame.display.flip()
    clock.tick(30)

# Cleanup
pygame.quit()
sys.exit()
