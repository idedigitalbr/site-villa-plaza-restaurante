import datetime
import os
import sys
import getpass

def install_package(package):
    import subprocess
    print(f"Instalando a biblioteca '{package}' necessária...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"'{package}' instalada com sucesso!")
    except Exception as e:
        print(f"Erro ao instalar '{package}': {e}")
        print(f"Por favor, tente rodar no terminal: pip install {package}")
        sys.exit(1)

# Verificar se o instaloader está instalado
try:
    import instaloader
except ImportError:
    install_package("instaloader")
    import instaloader

def main():
    print("=" * 65)
    print("      Downloader de Fotos do Instagram - Posts de 2026")
    print("=" * 65)
    
    target_profile = "thewinebelem"
    year = 2026
    since = datetime.datetime(year, 12, 31, 23, 59, 59)
    until = datetime.datetime(year, 1, 1, 0, 0, 0)
    
    # Configurar Instaloader
    # download_videos=False para baixar apenas fotos
    L = instaloader.Instaloader(
        download_videos=False, 
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        post_metadata_txt_pattern='',
        filename_pattern='{date_utc}_UTC_{shortcode}'
    )
    
    print("\nO Instagram exige autenticação (login ou cookies) para acessar perfis de forma confiável.")
    print("Escolha o método de autenticação:")
    print("1) Login com Usuário e Senha (Recomendado - a sessão ficará salva no computador)")
    print("2) Carregar cookies do Navegador (Chrome, Firefox, Edge, etc.)")
    print("3) Continuar sem login (Geralmente falha devido a bloqueio do Instagram)")
    
    try:
        choice = input("\nDigite a opção desejada (1, 2 ou 3): ").strip()
    except KeyboardInterrupt:
        print("\nCancelado pelo usuário.")
        sys.exit(0)
        
    logged_in = False
    
    if choice == '1':
        username = input("Digite seu nome de usuário do Instagram: ").strip()
        try:
            L.load_session_from_file(username)
            print(f"Sessão anterior para {username} carregada com sucesso.")
            logged_in = True
        except FileNotFoundError:
            password = getpass.getpass("Digite sua senha do Instagram (não será exibida ao digitar): ")
            try:
                print("Fazendo login no Instagram...")
                L.login(username, password)
                L.save_session_to_file()
                print(f"Login realizado e sessão salva para {username}!")
                logged_in = True
            except Exception as e:
                print(f"Erro ao fazer login: {e}")
                sys.exit(1)
                
    elif choice == '2':
        try:
            import browser_cookie3
        except ImportError:
            install_package("browser-cookie3")
            try:
                import browser_cookie3
            except ImportError:
                print("Não foi possível carregar browser-cookie3 automaticamente.")
                sys.exit(1)
                
        print("\nQual navegador você usa e está logado no Instagram?")
        print("1) Chrome")
        print("2) Firefox")
        print("3) Edge")
        print("4) Brave")
        print("5) Detectar automaticamente (Qualquer navegador)")
        
        try:
            browser_choice = input("Opção (1-5): ").strip()
        except KeyboardInterrupt:
            print("\nCancelado.")
            sys.exit(0)
            
        try:
            print("Carregando cookies...")
            if browser_choice == '1':
                cookies = browser_cookie3.chrome(domain_name='instagram.com')
            elif browser_choice == '2':
                cookies = browser_cookie3.firefox(domain_name='instagram.com')
            elif browser_choice == '3':
                cookies = browser_cookie3.edge(domain_name='instagram.com')
            elif browser_choice == '4':
                cookies = browser_cookie3.brave(domain_name='instagram.com')
            else:
                cookies = browser_cookie3.load(domain_name='instagram.com')
                
            L.context._session.cookies.update(cookies)
            print("Cookies carregados! Testando conexão com Instagram...")
            logged_in = True
        except Exception as e:
            print(f"Erro ao carregar cookies: {e}")
            print("\nDICA: Certifique-se de que você está logado no Instagram no navegador selecionado, e feche o navegador completamente antes de rodar o script para evitar bloqueios de arquivo.")
            sys.exit(1)
            
    else:
        print("Tentando carregar dados publicamente sem login...")
        
    print(f"\nBuscando posts de @{target_profile}...")
    try:
        profile = instaloader.Profile.from_username(L.context, target_profile)
        print(f"Perfil @{target_profile} carregado. Total de posts: {profile.mediacount}")
    except Exception as e:
        print(f"Erro ao carregar dados do perfil: {e}")
        if not logged_in:
            print("\nDICA: O Instagram bloqueou a consulta anônima. Por favor, rode o script novamente e escolha a Opção 1 ou 2 para autenticar.")
        sys.exit(1)
        
    output_dir = f"{target_profile}_instagram_{year}"
    os.makedirs(output_dir, exist_ok=True)
    abs_output_path = os.path.abspath(output_dir)
    print(f"As fotos serão salvas na pasta: {abs_output_path}")
    
    count = 0
    downloaded = 0
    
    print(f"\nFiltrando posts do ano de {year} (entre {until.strftime('%d/%m/%Y')} e {since.strftime('%d/%m/%Y')})...")
    
    try:
        for post in profile.get_posts():
            post_date = post.date_utc
            if post_date < until:
                print(f"Post de {post_date.strftime('%d/%m/%Y')} é de antes de 2026. Parando a busca.")
                break
                
            if post_date <= since:
                count += 1
                if not post.is_video:
                    print(f"[{count}] Post de {post_date.strftime('%d/%m/%Y %H:%M')} - Baixando foto(s)...")
                    try:
                        L.download_post(post, target=output_dir)
                        downloaded += 1
                    except Exception as e:
                        print(f"Erro ao baixar o post {post.shortcode}: {e}")
                else:
                    print(f"[{count}] Post de {post_date.strftime('%d/%m/%Y %H:%M')} - Ignorando (Vídeo)")
                    
        print("\n" + "=" * 65)
        print(f"Pronto! Analisados {count} posts do ano {year}.")
        print(f"Fotos baixadas com sucesso de {downloaded} posts.")
        print(f"Arquivos salvos em: {abs_output_path}")
        print("=" * 65)
        
    except Exception as e:
        print(f"\nOcorreu um erro durante o download: {e}")
        print("Dica: O Instagram pode ter imposto um limite de requisições temporário. Tente novamente mais tarde.")

if __name__ == "__main__":
    main()
