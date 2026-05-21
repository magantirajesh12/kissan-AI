import pygame
import sys
import math

# Initialize Pygame
pygame.init()

# Screen setup
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Kisan AI - Agricultural Assistant")

# Colors (Agricultural theme)
DARK_GREEN = (34, 89, 52)          # Deep field green
LIGHT_GREEN = (76, 175, 80)        # Light grass green
EMERALD = (16, 185, 129)           # Emerald green
GOLD = (255, 193, 7)               # Sunlight
CREAM = (245, 245, 220)            # Sky
DARK_BLUE = (13, 71, 161)          # Night sky
WHITE = (255, 255, 255)
ORANGE = (255, 140, 0)             # Sunset

# Animation variables
glow_circle_x, glow_circle_y = 100, 100
glow_dx, glow_dy = 2, 2
glow_radius = 30
time_counter = 0

clock = pygame.time.Clock()
font_large = pygame.font.Font(None, 48)
font_small = pygame.font.Font(None, 24)

def draw_background():
    """Draw agricultural-themed background"""
    # Sky gradient effect (simple version)
    for y in range(SCREEN_HEIGHT):
        ratio = y / SCREEN_HEIGHT
        r = int(CREAM[0] * (1 - ratio) + DARK_BLUE[0] * ratio)
        g = int(CREAM[1] * (1 - ratio) + DARK_BLUE[1] * ratio)
        b = int(CREAM[2] * (1 - ratio) + DARK_BLUE[2] * ratio)
        pygame.draw.line(screen, (r, g, b), (0, y), (SCREEN_WIDTH, y))

def draw_field():
    """Draw stylized agricultural field"""
    field_height = SCREEN_HEIGHT // 3
    
    # Far field (lighter)
    pygame.draw.rect(screen, LIGHT_GREEN, (0, SCREEN_HEIGHT - field_height * 2, SCREEN_WIDTH, field_height))
    
    # Near field (darker)
    pygame.draw.rect(screen, DARK_GREEN, (0, SCREEN_HEIGHT - field_height, SCREEN_WIDTH, field_height))
    
    # Field texture lines (crops)
    for i in range(0, SCREEN_WIDTH, 30):
        pygame.draw.line(screen, EMERALD, (i, SCREEN_HEIGHT - field_height), (i, SCREEN_HEIGHT), 2)

def draw_sun(x, y, radius=50):
    """Draw animated sun"""
    # Sun glow
    pygame.draw.circle(screen, ORANGE, (x, y), radius + 10)
    pygame.draw.circle(screen, GOLD, (x, y), radius)

def draw_particles(x, y, size=5, color=EMERALD):
    """Draw glowing particle effect"""
    for angle in range(0, 360, 45):
        rad = math.radians(angle)
        px = x + math.cos(rad) * size
        py = y + math.sin(rad) * size
        pygame.draw.circle(screen, color, (int(px), int(py)), 3)

def draw_floating_leaves(time):
    """Draw animated falling leaves"""
    num_leaves = 5
    for i in range(num_leaves):
        leaf_x = 100 + i * 120 + math.sin(time * 0.02 + i) * 30
        leaf_y = 50 + (time * 0.5 + i * 60) % SCREEN_HEIGHT
        pygame.draw.polygon(screen, LIGHT_GREEN, [
            (leaf_x, leaf_y),
            (leaf_x + 10, leaf_y + 5),
            (leaf_x + 8, leaf_y + 15),
            (leaf_x - 2, leaf_y + 10)
        ])

def draw_text_overlay():
    """Draw Kissan AI text overlay"""
    title = font_large.render("Kisan AI", True, EMERALD)
    subtitle = font_small.render("Agricultural Assistant", True, WHITE)
    
    title_rect = title.get_rect(center=(SCREEN_WIDTH // 2, 60))
    subtitle_rect = subtitle.get_rect(center=(SCREEN_WIDTH // 2, 110))
    
    # Semi-transparent background for text
    pygame.draw.rect(screen, (0, 0, 0, 100), (title_rect.x - 20, title_rect.y - 10, title_rect.width + 40, 80))
    
    screen.blit(title, title_rect)
    screen.blit(subtitle, subtitle_rect)

def draw_animated_circle(x, y, radius, time):
    """Draw glowing animated circle with pulsing effect"""
    # Pulsing glow effect
    pulse = math.sin(time * 0.05) * 10 + 20
    
    # Outer glow
    pygame.draw.circle(screen, (76, 175, 80, 100), (int(x), int(y)), int(radius + pulse), 3)
    
    # Main circle
    pygame.draw.circle(screen, EMERALD, (int(x), int(y)), int(radius))
    
    # Inner bright spot
    pygame.draw.circle(screen, WHITE, (int(x), int(y)), int(radius * 0.3))

# Main animation loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                running = False

    # Update time counter
    time_counter += 1

    # Draw background
    draw_background()
    
    # Draw field
    draw_field()
    
    # Draw animated sun
    sun_x = SCREEN_WIDTH * 0.8
    sun_y = 80 + math.sin(time_counter * 0.005) * 20
    draw_sun(int(sun_x), int(sun_y), 40)
    
    # Draw floating leaves
    draw_floating_leaves(time_counter)
    
    # Draw main animated circle
    glow_circle_x += glow_dx
    glow_circle_y += glow_dy
    
    # Bounce effect
    if glow_circle_x <= glow_radius or glow_circle_x >= SCREEN_WIDTH - glow_radius:
        glow_dx = -glow_dx
    if glow_circle_y <= glow_radius or glow_circle_y >= SCREEN_HEIGHT - glow_radius:
        glow_dy = -glow_dy
    
    # Draw the animated circle with pulsing glow
    draw_animated_circle(glow_circle_x, glow_circle_y, glow_radius, time_counter)
    
    # Draw particle effects around circle
    if time_counter % 5 == 0:
        draw_particles(glow_circle_x, glow_circle_y, 40, GOLD)
    
    # Draw text overlay
    draw_text_overlay()
    
    # Update display
    pygame.display.flip()
    clock.tick(30)

# Cleanup
pygame.quit()
sys.exit()
